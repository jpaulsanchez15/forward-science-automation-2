import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardsProps = {
  title?: string;
  description?: string;
};

const Cards = ({ title, description }: CardsProps) => {
  return (
    <Card className="hover:bg-gray-200 dark:hover:bg-slate-800">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export { Cards };
