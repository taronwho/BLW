/**
 * Paleta kreslených ikon surovin.
 *
 * Pevné barvy, ne proměnné motivu: mrkev je oranžová ve světlém i tmavém
 * režimu. Tón je vždycky střední — čistě bílá by na světlém podkladu zmizela,
 * čerň na tmavém. Jedna paleta pro celou sadu drží ikony pohromadě jako
 * rodinu, i když je kreslím po dávkách.
 */
export const C = {
  zelen: '#4F9E52',
  zelenTmava: '#37753C',
  zelenSvetla: '#8FC45A',
  zelenBleda: '#C7DF9E',

  cervena: '#D8483F',
  cervenaTmava: '#A32F2C',
  ruzova: '#E4708A',

  fialova: '#8E3B6B',
  fialovaTmava: '#66284C',

  oranzova: '#E8883A',
  zluta: '#E9C23F',
  zlutaTmava: '#C79A22',

  krem: '#F0E2C2',
  kremTmavy: '#D6BE92',
  bila: '#F4F1E7',
  bilaStin: '#D9D3C2',

  hneda: '#8C6239',
  hnedaSvetla: '#B98A56',
  hnedaTmava: '#5E4023',

  seda: '#A8A79C',
  sedaTmava: '#7A7A70',
} as const;
