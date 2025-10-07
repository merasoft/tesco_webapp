import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { IconFieldModule } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';

// Pipes
import { NumberFormatPipe } from './pipes/number-format.pipe';

const PRIME_NG_MODULES = [
  AccordionModule,
  BadgeModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CheckboxModule,
  DialogModule,
  DrawerModule,
  DropdownModule,
  GalleriaModule,
  IconFieldModule,
  IftaLabelModule,
  InputIconModule,
  InputNumberModule,
  InputTextModule,
  RippleModule,
  SelectModule,
  SliderModule,
  ToastModule,
];

const ANGULAR_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const PIPES = [NumberFormatPipe];

@NgModule({
  declarations: [...PIPES],
  imports: [...ANGULAR_MODULES, ...PRIME_NG_MODULES],
  exports: [...ANGULAR_MODULES, ...PRIME_NG_MODULES, ...PIPES],
})
export class SharedModule {}
