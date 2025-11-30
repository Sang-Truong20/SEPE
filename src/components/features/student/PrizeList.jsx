import { TrophyOutlined, DollarOutlined, GiftOutlined } from '@ant-design/icons';
import { Card, Empty, Spin, Tag } from 'antd';
import { useGetPrize } from '../../../hooks/student/prize';

const PrizeList = ({ hackathonId }) => {
  const { data: prizes = [], isLoading } = useGetPrize(hackathonId);

  const getPrizeTypeIcon = (prizeType) => {
    switch (prizeType?.toLowerCase()) {
      case 'cash':
        return <DollarOutlined />;
      case 'gift':
        return <GiftOutlined />;
      default:
        return <TrophyOutlined />;
    }
  };

  const getPrizeTypeColor = (prizeType) => {
    switch (prizeType?.toLowerCase()) {
      case 'cash':
        return 'green';
      case 'gift':
        return 'purple';
      default:
        return 'gold';
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Tag color="gold" icon={<TrophyOutlined />}>Hạng 1</Tag>;
      case 2:
        return <Tag color="default" icon={<TrophyOutlined />}>Hạng 2</Tag>;
      case 3:
        return <Tag color="orange" icon={<TrophyOutlined />}>Hạng 3</Tag>;
      default:
        return <Tag color="blue">Hạng {rank}</Tag>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (!prizes || prizes.length === 0) {
    return <Empty description="Chưa có giải thưởng nào" />;
  }

  // Sort prizes by rank
  const sortedPrizes = [...prizes].sort((a, b) => (a.rank || 0) - (b.rank || 0));

  return (
    <div className="space-y-3">
      {sortedPrizes.map((prize) => (
        <Card
          key={prize.prizeId}
          className="bg-card-background/50 border border-card-border/50"
          size="small"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {getRankBadge(prize.rank)}
                <Tag 
                  color={getPrizeTypeColor(prize.prizeType)} 
                  icon={getPrizeTypeIcon(prize.prizeType)}
                >
                  {prize.prizeType}
                </Tag>
              </div>
              <h4 className="text-text-primary font-medium mb-1">
                {prize.prizeName}
              </h4>
              <p className="text-text-secondary text-sm">
                Phần thưởng: <span className="font-semibold text-primary">{prize.reward}</span>
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PrizeList;

