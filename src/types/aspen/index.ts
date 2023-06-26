export type AspenFulfillCardProps = {
  orderNumber: string | null;
  orderContents: string | JSX.Element[] | JSX.Element | null;
  orderPrice: string | null;
  officeName: string | null;
  madeBy: string | null;
  buttonText?: string;
  completed?: boolean | null;
  disabled?: boolean;
  ordoroLink?: string | null;
  handler?: () => void | Promise<void> | Promise<unknown>;
  deleteHandler?: () => void | Promise<void> | Promise<unknown>;
  fileAwayHandler?: () => void | Promise<void> | Promise<unknown>;
  processing?: boolean;
};
