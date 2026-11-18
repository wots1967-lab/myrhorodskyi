// Освіта і підготовка — дані для блоку «Освіта і підготовка» на головній.
// Поки список порожній, блок на сайті НЕ показується.
//
// Як заповнювати (приклад формату):
// {
//   title: 'Освіта',
//   items: [
//     { title: 'Магістр психології', details: 'Назва університету · 20XX' },
//   ],
// },

export interface CredentialItem {
  title: string;
  details?: string;
}

export interface CredentialGroup {
  title: string;
  items: CredentialItem[];
}

export const credentialGroups: CredentialGroup[] = [];
