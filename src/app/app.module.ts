import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerSliderComponent } from './components/banner-slider/banner-slider.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AddressDrawerComponent } from './components/address-drawer/address-drawer.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { HistoryComponent } from './pages/history/history.component';
import { AccountComponent } from './pages/account/account.component';
import { DeliveryAddressesComponent } from './pages/delivery-addresses/delivery-addresses.component';
import { SharedModule } from './shared/shared.module';

// PrimeNG Config
import Lara from '@primeng/themes/lara';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

// Register Russian locale
registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    PaymentComponent,
    WishlistComponent,
    HistoryComponent,
    AccountComponent,
    DeliveryAddressesComponent,
    HeaderComponent,
    SearchBarComponent,
    AddressDrawerComponent,
    ProductCardComponent,
    CategoryListComponent,
    BannerSliderComponent,
    FiltersComponent,
    FooterComponent,
    MainLayoutComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, SharedModule],
  providers: [
    MessageService,
    { provide: LOCALE_ID, useValue: 'ru' },
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: '.dark-mode',
          cssLayer: {
            name: 'primeng',
            order: 'base, primeng, utilities components',
          },
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
