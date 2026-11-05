export interface NavItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr?: string;
  descEn?: string;
  icon: string;
}

export interface NavGroup {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  items: NavItem[];
}

export interface AppUser {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  college?: string;
  car?: string;
  walletBalance: number;
  avatarColor?: string;
}
