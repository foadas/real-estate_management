import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { TicketDto } from '../auth/dto/ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private propertyService: TicketService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
  postProperty(@Req() req: Request, @Body() dto: TicketDto) {
    return this.propertyService.postTicket(req.user, dto);
  }
}
