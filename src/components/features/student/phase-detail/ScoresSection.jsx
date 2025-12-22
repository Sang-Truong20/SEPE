import { BarChartOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Tag } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetMyScoresGrouped, useGetTeamOverview } from '../../../../hooks/student/score';
import { useGetCriteriaByPhase } from '../../../../hooks/student/criterion';
import { useGetTeamAppeals } from '../../../../hooks/student/appeal';

const ScoresSection = ({
  teamId,
  hasJoinedHackathon,
  isLeader,
  onOpenScoreAppealModal,
}) => {
  const { phaseId } = useParams();

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

  // Get criteria for mapping criterionId to name
  const { data: criteriaData } = useGetCriteriaByPhase(phaseId);
  const criteria = React.useMemo(() => {
    if (!criteriaData) return [];
    return Array.isArray(criteriaData)
      ? criteriaData
      : Array.isArray(criteriaData?.data)
        ? criteriaData.data
        : [];
  }, [criteriaData]);

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
            };
          }

          // Collect individual judge scores
          criteriaMap[criterionId].judgeScores.push({
            judgeId: judge.judgeId,
            judgeName: judge.judgeName,
            submissionId: submission.submissionId,
            submissionTitle: submission.submissionTitle,
            score: cs.score,
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

  // Get appeals for checking score appeals
  const { data: appealsData = [] } = useGetTeamAppeals(
    teamId,
    { enabled: !!teamId }
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

          {/* Criteria Scores */}
          {Array.isArray(scores.criteriaScores) && scores.criteriaScores.length > 0 ? (
            <div className="mt-4">
              <h5 className="text-md font-semibold text-text-primary mb-3">
                Chi tiết điểm theo tiêu chí
              </h5>
              <div className="space-y-3">
                {scores.criteriaScores.map((criteriaScore, idx) => {
                  const criterion = criteria.find(c =>
                    (c.criterionId || c.id) === criteriaScore.criterionId
                  );
                  
                  // Check if this criterion has any appeal (for old format)
                  const hasAnyAppeal = !isJudgesStructure && hasScoreAppeal(criteriaScore);
                  
                  return (
                    <div
                      key={criteriaScore.criterionId || `criterion-${idx}`}
                      className="p-3 bg-card-background/50 rounded-lg border border-card-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-primary font-medium text-sm">
                          {criterion?.name || `Tiêu chí ${criteriaScore.criterionId}`}
                        </span>
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

                      {/* Show per-judge scores if judges structure */}
                      {isJudgesStructure && criteriaScore.judgeScores && criteriaScore.judgeScores.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-muted-foreground font-medium mb-2">Điểm từng giám khảo:</p>
                          {criteriaScore.judgeScores.map((judgeScore, jsIdx) => {
                            const judgeHasAppeal = hasScoreAppeal(
                              { criterionId: criteriaScore.criterionId },
                              judgeScore.judgeId,
                              judgeScore.submissionId
                            );
                            
                            return (
                              <div
                                key={jsIdx}
                                className="pl-3 border-l-2 border-primary/30 py-2 bg-card-background/30 rounded"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex-1">
                                    <span className="text-text-primary text-xs font-medium">
                                      {judgeScore.judgeName}
                                    </span>
                                    {judgeScore.submissionTitle && (
                                      <span className="text-muted-foreground text-xs ml-2">
                                        ({judgeScore.submissionTitle})
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Tag color="blue" size="small" className="font-semibold">
                                      {judgeScore.score !== undefined && judgeScore.score !== null
                                        ? Number(judgeScore.score).toFixed(2)
                                        : '-'}
                                    </Tag>
                                    {judgeHasAppeal && (
                                      <Tag color="orange" size="small">
                                        Đã phúc khảo
                                      </Tag>
                                    )}
                                  </div>
                                </div>
                                {judgeScore.comment && (
                                  <p className="text-text-secondary text-xs mt-1 italic">
                                    &ldquo;{judgeScore.comment}&rdquo;
                                  </p>
                                )}
                                {isLeader && !judgeHasAppeal && (
                                  <div className="mt-2">
                                    <Button
                                      type="primary"
                                      size="small"
                                      icon={<SendOutlined />}
                                      onClick={() => onOpenScoreAppealModal({
                                        criterionId: criteriaScore.criterionId,
                                        judgeId: judgeScore.judgeId,
                                        submissionId: judgeScore.submissionId,
                                        score: judgeScore.score,
                                        comment: judgeScore.comment,
                                        judgeName: judgeScore.judgeName,
                                        submissionTitle: judgeScore.submissionTitle,
                                      })}
                                      className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 border-0 text-xs"
                                    >
                                      Phúc khảo điểm
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

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

