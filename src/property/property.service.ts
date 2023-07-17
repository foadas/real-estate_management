import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../typeprm/entities/property.model';
import { Repository } from 'typeorm';
import { PropertyDto, UpdatePropertyDto } from '../auth/dto/property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}

  async getProperties(user: Express.User, params: any) {
    const properties = await this.propertyRepo.find({
      where: {
        user: user,
        name: params.name,
        location: params.location,
        size: params.size,
      },
    });
    return properties;
  }

  async postProperty(user: Express.User, dto: PropertyDto) {
    try {
      const createdProperty = await this.propertyRepo.create({
        user: user,
        ...dto,
      });
      const savedProperty = await this.propertyRepo.save(createdProperty);
      return { saved: savedProperty };
    } catch (error: any) {
      return error;
    }
  }

  async updateProperty(id, dto: UpdatePropertyDto, user: Express.User) {
    //check the user access
    try {
      const updatedProperty = this.propertyRepo.update(
        { id, user: user },
        { ...dto },
      );
      return updatedProperty;
    } catch (error: any) {
      return error;
    }
  }
  async deleteProperty(id, user: Express.User) {
    try {
      const deletedProperty = this.propertyRepo.delete({ id, user: user });
      return deletedProperty;
    } catch (error) {
      return error;
    }
  }
}
