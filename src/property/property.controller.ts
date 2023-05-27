import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PropertyService } from './property.service';
import { PropertyDto } from '../auth/dto/property.dto';

@Controller('properties')
export class PropertyController {
  constructor(private propertyService: PropertyService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProperties(@Req() req: Request, @Query() params: any) {
    return this.propertyService.getProperties(req.user, params);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  postProperty(@Body() dto: PropertyDto) {
    return this.propertyService.postProperty(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updatePropertyById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedProperty: PropertyDto,
  ) {
    return this.propertyService.updateProperty(id, updatedProperty);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletePropertyById(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.deleteProperty(id);
  }
}
