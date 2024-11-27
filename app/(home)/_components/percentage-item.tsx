interface PercentageItemProps {
  icon: React.ReactNode;
  title: string;
  amount: number;
}

const PercentageItem = ({ icon, title, amount }: PercentageItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
      <p className="text-sm font-bold">{amount}%</p>
    </div>
  );
};

export default PercentageItem;
