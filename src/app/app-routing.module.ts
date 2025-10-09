import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { HistoryComponent } from './pages/history/history.component';
import { AccountComponent } from './pages/account/account.component';
import { DeliveryAddressesComponent } from './pages/delivery-addresses/delivery-addresses.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'account', component: AccountComponent },
  { path: 'delivery-addresses', component: DeliveryAddressesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
