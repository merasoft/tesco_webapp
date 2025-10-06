import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';

// Pipes
import { NumberFormatPipe } from './pipes/number-format.pipe';

const PRIME_NG_MODULES = [BadgeModule, ButtonModule, CardModule, CarouselModule, DropdownModule, IconFieldModule, IftaLabelModule, InputIconModule, InputTextModule, RippleModule, SelectModule];

const ANGULAR_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const PIPES = [NumberFormatPipe];

@NgModule({
  declarations: [...PIPES],
  imports: [...ANGULAR_MODULES, ...PRIME_NG_MODULES],
  exports: [...ANGULAR_MODULES, ...PRIME_NG_MODULES, ...PIPES],
})
export class SharedModule {}
