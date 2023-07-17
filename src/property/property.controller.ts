import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PropertyService } from './property.service';
import { PropertyDto, UpdatePropertyDto } from "../auth/dto/property.dto";

@Controller('properties')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProperties(@Req() req: Request, @Query() params: any) {
    return this.propertyService.getProperties(req.user, params);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  postProperty(@Req() req: Request, @Body() dto: PropertyDto) {
    return this.propertyService.postProperty(req.user, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updatePropertyById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedProperty: UpdatePropertyDto,
    @Req() req: Request,
  ) {
    return this.propertyService.updateProperty(id, updatedProperty, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletePropertyById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.propertyService.deleteProperty(id,req.user);
  }
}
