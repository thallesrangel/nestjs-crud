import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateServicePasswordDTO } from './dto/create-service-password.dto';
import { ServicePasswordService } from './service-password.service';
import { ServicePasswordGroupService } from 'src/servicePasswordGroup/service-password-group.service';
import { PasswordType } from 'src/enums/service-password-type.enum';
import { ServicePasswordServiceLog } from 'src/servicePasswordLog/service-password-log.service';
import { PasswordTypeLog } from 'src/enums/service-password-type-log.enum';
import { AppGateway } from 'src/webSocketGateway/web-socket-gateway.gateway';
import { GeneratePdfService } from 'src/generatePdf/generate-pdf.service';
import * as path from 'path';
import * as fs from 'fs'; // Importa o módulo fs padrão
import { promises as fsp } from 'fs';

// AuthGuard verifica se está autenticado
// Role verifica a permissão
@UseGuards(AuthGuard, RoleGuard)
@Controller('service_passwords')
export class ServicePasswordController {
  constructor(
    private readonly servicePasswordService: ServicePasswordService,
    private readonly servicePasswordGroupService: ServicePasswordGroupService,
    private readonly servicePasswordServiceLog: ServicePasswordServiceLog,
    private readonly appGateway: AppGateway,
    private readonly serviceGeneratePdf: GeneratePdfService
  ) {}

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post()
  async create(
    @Body() { id_patient, id_place, type }: CreateServicePasswordDTO,
    @Req() req,
    @Res() res,
  ) {
    const id_clinic = req.tokenPayload.id_clinic;

    // Verifica se existe um grupo ativo (deleted = false) para a clinica
    const checkExistsServicePasswordGroupActive =
      await this.servicePasswordGroupService.existis(id_clinic);

    var servicePasswordGroupId: number;

    // Verifica se o grupo de senhas existe, caso não existir ele cria um novo grupo e retorna o ID - id_service_password_group
    if (!checkExistsServicePasswordGroupActive) {
      const createServicePasswordGroup =
        await this.servicePasswordGroupService.create(id_clinic);
      var servicePasswordGroupId = createServicePasswordGroup.id;
    } else {
      var servicePasswordGroupId = checkExistsServicePasswordGroupActive.id;
    }

    servicePasswordGroupId = Number(servicePasswordGroupId);

    // Verifica a última senha criada na tabela servicePassword usando as colunas id_clinic e id_service_group_id
    const lastServicePasswordGenerated =
      await this.servicePasswordService.lastServicePasswordGenerated(
        id_clinic,
        servicePasswordGroupId,
      );

    if (lastServicePasswordGenerated) {
      var nextPasswordNumber = lastServicePasswordGenerated.number + 1;
    } else {
      var nextPasswordNumber = 1;
    }

    const password = await this.servicePasswordService.create({
      id_service_password_group: servicePasswordGroupId,
      id_clinic: Number(id_clinic),
      id_patient: id_patient ?? null,
      id_place,
      number: nextPasswordNumber,
      type,
    });

    if (password) {
      try {
        const fileName = await this.serviceGeneratePdf.createPasswordPDF(password);
  
        // Constrói a URL pública do PDF
        const publicUrl = `/pdf/download/${fileName}`;
  
        // Retorna a URL do PDF em JSON
        res.json({ url: publicUrl });
      } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
      }
    }
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post('being_served_by_place')
  async beingServed(@Body() { id_place }, @Req() req) {
    const id_clinic = req.tokenPayload.id_clinic;
    const senhaAtualEmAtendimento =
      await this.servicePasswordService.getAtualSenhaEmAtendimento(
        Number(id_clinic),
        Number(id_place),
      );

    return senhaAtualEmAtendimento;
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post('being_served_by_clinic')
  async beingServedByClinic(@Req() req) {
    const id_clinic = req.tokenPayload.id_clinic;

    const senhaAtualEmAtendimento =
      await this.servicePasswordService.getAtualSenhaEmAtendimentoByClinic(
        Number(id_clinic),
      );

    // Se não existir senha em atendimento, simplismente pega a última senha do log e exibe.
    if (!senhaAtualEmAtendimento) {
      return await this.servicePasswordServiceLog.getLastInsertedByClinicId(
        Number(id_clinic),
      );
    }

    return senhaAtualEmAtendimento;
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post('finish')
  async finishPassword(@Body() { id_password_service }) {
    if (!id_password_service) {
      throw new BadRequestException('Não há atendimento para ser encerrada.');
    }

    const finished =
      await this.servicePasswordService.setStatusServiced(id_password_service);

    if (!finished) {
      throw new BadRequestException(
        'Não foi possível encerrar o atendimento. Tente novamente',
      );
    }

    const createLog = await this.servicePasswordServiceLog.create({
      id_clinic: finished.id_clinic,
      id_service_password_group: finished.id_service_password_group,
      id_service_password: finished.id,
      id_patient: finished.id_patient,
      id_place: finished.id_place,
      guiche: finished.guiche,
      number: finished.number,
      type: finished.type as PasswordTypeLog,
    });

    if (!createLog) {
      throw new BadRequestException(
        'Atendimento encerrado mas não foi possível registrar no histórico.',
      );
    }

    this.appGateway.sendMessageToRoom(createLog.id_clinic, {
      action: 'update',
    });

    return true;
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post('call_again_password')
  async callAgainPassword(@Body() { id_password_service }) {
    if (!id_password_service) {
      throw new BadRequestException(
        'Não há atendimento para ser novamente chamado.',
      );
    }

    const callAgain =
      await this.servicePasswordService.setStatusEmAtendimentoByPasswordId(
        id_password_service,
      );

    if (!callAgain) {
      throw new BadRequestException(
        'Não foi possível chamar a senha novamente. Tente novamente',
      );
    }

    this.appGateway.sendMessageToRoom(callAgain.id_clinic, {
      action: 'update',
    });

    return true;
  }

  @Roles(Role.Admin, Role.Manager, Role.User)
  @Post('call_next_password')
  async callNextPassword(@Body() { id_place, guiche }, @Req() req) {
    const id_clinic = req.tokenPayload.id_clinic;

    // Retorna todas as senhas com o grupo ativo e com status "aguardando" do place selecionado
    const allPasswordsAwaitingService =
      await this.servicePasswordService.getAllPasswordsAwaitingServiceByPlace(
        Number(id_clinic),
        Number(id_place),
      );

    let nextPreferencialPassword;
    let nextNormalPassword;

    if (allPasswordsAwaitingService.length === 0) {
      throw new BadRequestException('Não há senhas para serem chamadas.');
    }

    allPasswordsAwaitingService.forEach((password) => {
      // Pega o primeiro preferencial da lista
      if (
        password.type === PasswordType.preferencial &&
        !nextPreferencialPassword
      ) {
        nextPreferencialPassword = password;
      }

      // Pega o primeiro normal da lista
      if (password.type === PasswordType.normal && !nextNormalPassword) {
        nextNormalPassword = password;
      }
    });

    const senhaAtualEmAtendimento =
      await this.servicePasswordService.getAtualSenhaEmAtendimento(
        Number(id_clinic),
        Number(id_place),
      );

    if (senhaAtualEmAtendimento) {
      throw new BadRequestException(
        'Existe uma senha em atendimento. Direcione ou encerre o atendimento para chamar o próximo.',
      );
    }

    if (nextPreferencialPassword) {
      await await this.servicePasswordService.setStatusEmAtendimento(
        nextPreferencialPassword.id,
        guiche,
      );

      this.appGateway.sendMessageToRoom(id_clinic, { action: 'update' });

      //TODO colocar status em atendido a senha se não enviado
      //TODO colocar status em atendimento da senha que vai ser a próxima, no caso se tiver preferencial
    } else if (nextNormalPassword) {
      await await this.servicePasswordService.setStatusEmAtendimento(
        nextNormalPassword.id,
        guiche,
      );

      this.appGateway.sendMessageToRoom(id_clinic, { action: 'update' });

      //TODO colocar status em atendido as senhas anteriores
      //TODO colocar status em atendimento da senha que vai ser a próxima, no caso se tiver normal
    } else {
      // Não há senhas
      return false;
    }

    return true;
  }

  // Fluxo, inicial de gereciamento de senhas
  // Clica em chamar próximo, até o momento não exibe nenhuma senha, ele busca na lista e coloca a atual como em atendimento
  // Você não tem como Chamar o próximo sem direcionar ou encerrar atendimento da senha atual
  // Quando chamamos o próximo, ele passa a ser EM ATENDIMENTO

  // Você precisa definir o setor para enviar a senha (direcionar)

  // Se eu encerrar o atendimento, vira ATENDIDO
  // Se eu NÃO direcionar o paciente e clicar em chamar pŕoximo, vira ATENDIDO
  // Se eu direcionar a senha, ele volta para AGUARDANDO só que com o ID do place novo, com updated_at E preenche a tabela password_service_log com os dados anteriores que fica sendo o histórico de chamadas

  // @Roles(Role.Admin, Role.Manager, Role.User)
  // @Post('count_awaiting_for_service_by_place')
  // async countAwaitForServiceByPlace(
  //   @Body() { id_place },
  //   @Req() req,
  // ) {

  //   const id_clinic = req.tokenPayload.id_clinic;

  //   // Retorna todas as senhas com o grupo ativo e com status "aguardando" do place selecionado
  //   const allPasswordsAwaitingService = await this.servicePasswordService.getAllPasswordsAwaitingServiceByPlace(
  //     Number(id_clinic),
  //     Number(id_place)
  //   );

  //   return allPasswordsAwaitingService;
  // }
}
