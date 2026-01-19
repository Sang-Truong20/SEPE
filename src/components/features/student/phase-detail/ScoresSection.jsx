import { BarChartOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Spin, Tag } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTeamPhaseAppeals } from '../../../../hooks/student/appeal';
import { useGetCriterion } from '../../../../hooks/student/criterion';
import { useGetMyScoresGrouped, useGetTeamOverview } from '../../../../hooks/student/score';

// Component to display criterion name by fetching from API
const CriterionName = ({ criterionId }) => {
  const { data: criterionData, isLoading } = useGetCriterion(criterionId);
  
  if (isLoading) {
    return <span className="text-text-primary font-medium text-sm">...</span>;
  }
  
  return (
    <span className="text-text-primary font-medium text-sm">
      {criterionData?.name || criterionData?.data?.name || `Tiêu chí ${criterionId}`}
    </span>
  );
};

const ScoresSection = ({
  teamId,
  hasJoinedHackathon,
  isLeader,
  onOpenScoreAppealModal,
}) => {
  const { phaseId } = useParams();
  const [appealingJudgeIds, setAppealingJudgeIds] = React.useState(new Set());

  // Get my scores grouped by phase
  const { data: scoresData, isLoading: scoresLoading } = useGetMyScoresGrouped(
    phaseId,
    { enabled: !!phaseId && hasJoinedHackathon }
  );

  // Get team overview scores
  const { data: teamOverviewData, isLoading: teamOverviewLoading } = useGetTeamOverview(
    teamId,
    phaseId,
    { enabled: !!teamId && !!phaseId && hasJoinedHackathon }
  );

  // Check if we have team overview data with judges structure (new format)
  const isJudgesStructure = React.useMemo(() => {
    return teamOverviewData && Array.isArray(teamOverviewData.judges) && teamOverviewData.judges.length > 0;
  }, [teamOverviewData]);

  // Check if we have team overview data with criteriaScores (old format)
  const isCriteriaScoresFormat = React.useMemo(() => {
    return teamOverviewData && teamOverviewData.criteriaScores && Array.isArray(teamOverviewData.criteriaScores);
  }, [teamOverviewData]);

  // Process judges structure: aggregate criteria scores across all judges/submissions
  const aggregatedCriteriaScores = React.useMemo(() => {
    if (!isJudgesStructure || !teamOverviewData?.judges) return null;

    const criteriaMap = {};

    // Flatten judges -> submissions -> criteriaScores
    teamOverviewData.judges.forEach(judge => {
      judge.submissions?.forEach(submission => {
        submission.criteriaScores?.forEach(cs => {
          const criterionId = cs.criterionId;
          
          if (!criteriaMap[criterionId]) {
            criteriaMap[criterionId] = {
              criterionId,
              scores: [],
              judgeScores: [],
              weight: cs.weight || 0, // Store weight
            };
          }

          // Collect individual judge scores
          criteriaMap[criterionId].judgeScores.push({
            judgeId: judge.judgeId,
            judgeName: judge.judgeName,
            submissionId: submission.submissionId,
            submissionTitle: submission.submissionTitle,
            score: cs.score,
            weight: cs.weight,
            comment: cs.comment,
          });

          // Collect scores for average calculation
          if (cs.score !== undefined && cs.score !== null) {
            criteriaMap[criterionId].scores.push(Number(cs.score));
          }
        });
      });
    });

    // Calculate average for each criterion
    return Object.values(criteriaMap).map(item => ({
      criterionId: item.criterionId,
      weight: item.weight,
      score: item.scores.length > 0
        ? item.scores.reduce((sum, val) => sum + val, 0) / item.scores.length
        : null,
      judgeScores: item.judgeScores,
    }));
  }, [teamOverviewData, isJudgesStructure]);

  const scores = React.useMemo(() => {
    // If judges structure, return aggregated data
    if (isJudgesStructure && aggregatedCriteriaScores) {
      return {
        ...teamOverviewData,
        criteriaScores: aggregatedCriteriaScores,
      };
    }

    // If criteriaScores format (old format), return as is
    if (isCriteriaScoresFormat) {
      return teamOverviewData;
    }

    // Otherwise use grouped scores format
    const dataToUse = scoresData;
    if (!dataToUse) return null;

    // Handle different response structures
    return Array.isArray(dataToUse)
      ? dataToUse
      : Array.isArray(dataToUse?.data)
        ? dataToUse.data
        : Array.isArray(dataToUse?.scores)
          ? dataToUse.scores
          : null;
  }, [scoresData, teamOverviewData, isJudgesStructure, isCriteriaScoresFormat, aggregatedCriteriaScores]);

  const scoresLoadingState = scoresLoading || teamOverviewLoading;

  // Get appeals for checking score appeals in current phase
  const { data: appealsData = [] } = useGetTeamPhaseAppeals(
    teamId,
    phaseId,
    { enabled: !!teamId && !!phaseId }
  );

  const appeals = Array.isArray(appealsData)
    ? appealsData
    : Array.isArray(appealsData?.data)
      ? appealsData.data
      : [];

  // Filter score appeals for current phase
  const scoreAppeals = React.useMemo(() => {
    return appeals.filter(appeal => appeal.appealType === 'Score');
  }, [appeals]);

  // Check if criteria score already has an appeal
  const hasScoreAppeal = (criteriaScore, judgeId, submissionId) => {
    const criterionId = criteriaScore.criterionId;
    return scoreAppeals.some(appeal => {
      const appealCriterionId = appeal.adjustmentId || appeal.criterionId;
      const matchesCriterion = appealCriterionId && Number(appealCriterionId) === Number(criterionId);
      
      // If judgeId and submissionId provided, check for specific appeal
      if (judgeId && submissionId) {
        return matchesCriterion && 
               appeal.judgeId === judgeId && 
               appeal.submissionId === submissionId;
      }
      
      // Otherwise check if any appeal exists for this criterion
      return matchesCriterion;
    });
  };
  if (scoresLoadingState) {
    return (
      <Card className="bg-card-background border border-card-border backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BarChartOutlined />
          Điểm số
        </h3>
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <BarChartOutlined />
        Điểm số
      </h3>
      {(isJudgesStructure || isCriteriaScoresFormat) && scores ? (
        <div className="space-y-4">
          {/* Team Overview Summary */}
          <div className="space-y-3">
            {scores.averageScore !== undefined && scores.averageScore !== null && (
              <div>
                <p className="text-muted-foreground text-sm">Điểm trung bình</p>
                <p className="text-text-primary font-semibold text-lg">
                  {Number(scores.averageScore).toFixed(2)}
                </p>
              </div>
            )}
            {scores.rank !== undefined && scores.rank !== null && (
              <div>
                <p className="text-muted-foreground text-sm">Hạng</p>
                <p className="text-text-primary font-semibold text-lg">
                  #{scores.rank}
                </p>
              </div>
            )}
          </div>

          {/* Judges Structure - Group by Judge */}
          {isJudgesStructure && teamOverviewData?.judges && teamOverviewData.judges.length > 0 ? (
            <div className="mt-4">
              <h5 className="text-md font-semibold text-text-primary mb-3">
                Chi tiết điểm theo giám khảo
              </h5>
              <Collapse
                items={teamOverviewData.judges.map((judge, judgeIdx) => {
                  // Get all criteria scores for this judge
                  const judgeAllScores = [];
                  judge.submissions?.forEach(submission => {
                    submission.criteriaScores?.forEach(cs => {
                      judgeAllScores.push({
                        criterionId: cs.criterionId,
                        score: cs.score,
                        weight: cs.weight,
                        comment: cs.comment,
                        submissionTitle: submission.submissionTitle,
                      });
                    });
                  });

                  // Calculate total score for this judge (score * weight / 10)
                  const totalScore = judgeAllScores.reduce((sum, item) => {
                    const weight = item.weight || 0;
                    const score = item.score !== undefined && item.score !== null ? Number(item.score) : 0;
                    return sum + (score * (weight / 10));
                  }, 0);

                  return {
                    key: judgeIdx,
                    label: (
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="text-text-primary font-semibold">
                          {judge.judgeName}
                        </span>
                        <div className="flex items-center gap-2">
                          <Tag color="green" className="font-semibold">
                            {totalScore.toFixed(2)}
                          </Tag>
                          {appeals.some(a => a.appealType === 'Score' && a.judgeId === judge.judgeId) ? (
                            <Tag color="blue" size="small">
                              Đã kháng cáo
                            </Tag>
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              icon={<SendOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAppealingJudgeIds(prev => new Set(prev).add(judge.judgeId));
                                onOpenScoreAppealModal({
                                  judgeId: judge.judgeId,
                                  judgeName: judge.judgeName,
                                  submissionId: judge.submissions?.[0]?.submissionId,
                                  submissionTitle: judge.submissions?.[0]?.submissionTitle,
                                  isJudgeAppeal: true,
                                  onAppealComplete: () => {
                                    setAppealingJudgeIds(prev => {
                                      const newSet = new Set(prev);
                                      newSet.delete(judge.judgeId);
                                      return newSet;
                                    });
                                  },
                                });
                              }}
                              disabled={appealingJudgeIds.has(judge.judgeId)}
                              className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 border-0 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {appealingJudgeIds.has(judge.judgeId) ? 'Đang gửi...' : 'Kháng cáo Score'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ),
                    children: (
                      <div className="space-y-3">
                        {judgeAllScores.length > 0 ? (
                          judgeAllScores.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="p-3 bg-card-background/50 rounded-lg border border-card-border/50"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <CriterionName criterionId={item.criterionId} />
                                  {item.submissionTitle && (
                                    <p className="text-muted-foreground text-xs mt-1">
                                      ({item.submissionTitle})
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Tag className="text-xs bg-slate-800 border-slate-700 text-slate-400">
                                    Trọng số: {(item.weight || 0) * 10}%
                                  </Tag>
                                  <Tag color="blue" className="font-semibold">
                                    {item.score !== undefined && item.score !== null
                                      ? Number(item.score).toFixed(2)
                                      : '-'}
                                  </Tag>
                                </div>
                              </div>
                              {item.comment && (
                                <p className="text-text-secondary text-xs italic mt-2">
                                  &ldquo;{item.comment}&rdquo;
                                </p>
                              )}
                              {isLeader && (
                                <div className="mt-3">
                                  <Button
                                    type="primary"
                                    size="small"
                                    icon={<SendOutlined />}
                                    onClick={() => onOpenScoreAppealModal({
                                      criterionId: item.criterionId,
                                      judgeId: judge.judgeId,
                                      score: item.score,
                                      comment: item.comment,
                                      judgeName: judge.judgeName,
                                      submissionTitle: item.submissionTitle,
                                    })}
                                    className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0 text-xs"
                                  >
                                    Phúc khảo điểm
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-xs">Chưa có điểm số</p>
                        )}
                      </div>
                    ),
                  };
                })}
                className="bg-card-background/30"
              />
            </div>
          ) : isCriteriaScoresFormat && Array.isArray(scores.criteriaScores) && scores.criteriaScores.length > 0 ? (
            <div className="mt-4">
              <h5 className="text-md font-semibold text-text-primary mb-3">
                Chi tiết điểm theo tiêu chí
              </h5>
              <div className="space-y-3">
                {scores.criteriaScores.map((criteriaScore, idx) => {
                  // Check if this criterion has any appeal (for old format)
                  const hasAnyAppeal = !isJudgesStructure && hasScoreAppeal(criteriaScore);
                  
                  return (
                    <div
                      key={criteriaScore.criterionId || `criterion-${idx}`}
                      className="p-3 bg-card-background/50 rounded-lg border border-card-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <CriterionName criterionId={criteriaScore.criterionId} />
                        <div className="flex items-center gap-2">
                          <Tag color="green" className="font-semibold">
                            {criteriaScore.score !== undefined && criteriaScore.score !== null
                              ? Number(criteriaScore.score).toFixed(2)
                              : '-'}
                          </Tag>
                          {hasAnyAppeal && (
                            <Tag color="blue" size="small">
                              Đã phúc khảo
                            </Tag>
                          )}
                        </div>
                      </div>

                      {/* Show comment for old format */}
                      {!isJudgesStructure && criteriaScore.comment && (
                        <p className="text-text-secondary text-xs mt-2">
                          {criteriaScore.comment}
                        </p>
                      )}

                      {/* Show appeal button for old format */}
                      {!isJudgesStructure && isLeader && !hasAnyAppeal && (
                        <div className="mt-3">
                          <Button
                            type="primary"
                            size="small"
                            icon={<SendOutlined />}
                            onClick={() => onOpenScoreAppealModal(criteriaScore)}
                            className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0"
                          >
                            Phúc khảo điểm
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <BarChartOutlined className="text-2xl mb-2 opacity-50" />
              <p className="text-xs">Chưa có điểm số theo tiêu chí</p>
            </div>
          )}
        </div>
      ) : scores && Array.isArray(scores) && scores.length > 0 ? (
        <div className="space-y-4">
          {scores.map((scoreGroup, index) => (
            <div
              key={scoreGroup.groupId || scoreGroup.id || index}
              className="space-y-3"
            >
              {scoreGroup.groupName && (
                <div className="flex items-center justify-between">
                  <h5 className="text-md font-semibold text-text-primary">
                    {scoreGroup.groupName}
                  </h5>
                  {scoreGroup.totalScore !== undefined && (
                    <Tag color="green" className="text-sm px-2 py-1">
                      Tổng: {scoreGroup.totalScore}
                    </Tag>
                  )}
                </div>
              )}

              {Array.isArray(scoreGroup.scores) && scoreGroup.scores.length > 0 ? (
                <div className="space-y-2">
                  {scoreGroup.scores.map((score, scoreIdx) => (
                    <div
                      key={score.scoreId || score.id || `score-${scoreIdx}`}
                      className="p-2 bg-card-background/50 rounded border border-card-border/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-text-primary text-sm font-medium">
                          {score.criteriaName || 'N/A'}
                        </span>
                        <span className="text-primary font-semibold text-sm">
                          {score.score !== undefined && score.score !== null
                            ? Number(score.score).toFixed(2)
                            : '-'}
                        </span>
                      </div>
                      {score.maxScore !== undefined && score.maxScore !== null && (
                        <p className="text-muted-foreground text-xs">
                          Tối đa: {Number(score.maxScore).toFixed(2)}
                        </p>
                      )}
                      {score.note && (
                        <p className="text-text-secondary text-xs mt-1">
                          {score.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs">Chưa có điểm số</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <BarChartOutlined className="text-2xl mb-2 opacity-50" />
          <p className="text-xs">Chưa có điểm số nào</p>
        </div>
      )}
    </Card>
  );
};

export default ScoresSection;

