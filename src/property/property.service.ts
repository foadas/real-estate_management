import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../typeprm/entities/property.model';
import { Repository } from 'typeorm';
import { PropertyDto } from '../auth/dto/property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}

  async getProperties(user: Express.User) {
    const properties = await this.propertyRepo.find({ where: { user: user } });
    return properties;
  }

  async postProperty(dto: PropertyDto) {
    try {
      const createdProperty = await this.propertyRepo.create({ ...dto });
      const savedProperty = await this.propertyRepo.save(createdProperty);
      return { saved: savedProperty };
    } catch (error: any) {
      return error;
    }
  }

  async updateProperty(id, dto: PropertyDto) {
    //check the user access
    try {
      const updatedProperty = this.propertyRepo.update({ id }, { ...dto });
      return updatedProperty;
    } catch (error: any) {
      return error;
    }
  }
  async deleteProperty(id) {
    try {
      const deletedProperty = this.propertyRepo.delete({ id });
      return deletedProperty;
    } catch (error) {
      return error;
    }
  }
  
}
