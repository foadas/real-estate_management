import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Property } from "./typeprm/entities/property.model";

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
