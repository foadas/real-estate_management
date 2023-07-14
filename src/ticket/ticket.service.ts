import { Injectable } from '@nestjs/common';
import { TicketDto } from '../auth/dto/ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../typeprm/entities/ticket.model';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
  ) {
  }

  async postTicket(user: Express.User, dto: TicketDto) {

    try {
      const createdTicket = await this.ticketRepo.create({
        user: user,
        ...dto,
        date: currentTime(),
      });
      const savedTicket = await this.ticketRepo.save(createdTicket);
      delete savedTicket.user;
      return { saved: savedTicket };
    } catch (error: any) {
      return error;
    }

    function currentTime() {
      const date = new Date();
      const a = date.getFullYear();
      const b = date.getMonth() + 1; // JS months are 0 indexed, 0 = January, 11 = December
      const c = date.getDate();
      return a + '-' + b + '-' + c;
    }
  }
}