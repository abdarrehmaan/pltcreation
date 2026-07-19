import { redirect } from 'next/navigation';

export default function AdminCouponsRedirectPage() {
  redirect('/admin/offers?tab=coupons');
}
