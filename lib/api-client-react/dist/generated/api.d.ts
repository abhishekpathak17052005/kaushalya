import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { CareerAdvice, CareerAdviceInput, DistrictIntelligence, Forecast, GetGovernmentDashboardParams, GovernmentDashboard, HealthStatus, Job, JobApplication, JobApplicationInput, JobInput, JobMatch, ListJobsParams, ListSkillDemandParams, Recommendation, Skill, SkillDemand, Trainee, TraineeDashboard, TraineeUpdate, TrainingProgram, TrainingProgramInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetGovernmentDashboardUrl: (params?: GetGovernmentDashboardParams) => string;
/**
 * @summary Get government intelligence dashboard
 */
export declare const getGovernmentDashboard: (params?: GetGovernmentDashboardParams, options?: Parameters<typeof customFetch>[1]) => Promise<GovernmentDashboard>;
export declare const getGetGovernmentDashboardQueryKey: (params?: GetGovernmentDashboardParams) => readonly ["/api/dashboard/government", ...GetGovernmentDashboardParams[]];
export declare const getGetGovernmentDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getGovernmentDashboard>>, TError = ErrorType<unknown>>(params?: GetGovernmentDashboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGovernmentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGovernmentDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGovernmentDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getGovernmentDashboard>>>;
export type GetGovernmentDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get government intelligence dashboard
 */
export declare function useGetGovernmentDashboard<TData = Awaited<ReturnType<typeof getGovernmentDashboard>>, TError = ErrorType<unknown>>(params?: GetGovernmentDashboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGovernmentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetTraineeDashboardUrl: (traineeId: string) => string;
/**
 * @summary Get trainee dashboard
 */
export declare const getTraineeDashboard: (traineeId: string, options?: Parameters<typeof customFetch>[1]) => Promise<TraineeDashboard>;
export declare const getGetTraineeDashboardQueryKey: (traineeId: string) => readonly [`/api/dashboard/trainee/${string}`];
export declare const getGetTraineeDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getTraineeDashboard>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTraineeDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTraineeDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTraineeDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getTraineeDashboard>>>;
export type GetTraineeDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get trainee dashboard
 */
export declare function useGetTraineeDashboard<TData = Awaited<ReturnType<typeof getTraineeDashboard>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTraineeDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListDistrictsUrl: () => string;
/**
 * @summary List district intelligence snapshots
 */
export declare const listDistricts: (options?: Parameters<typeof customFetch>[1]) => Promise<DistrictIntelligence[]>;
export declare const getListDistrictsQueryKey: () => readonly ["/api/districts"];
export declare const getListDistrictsQueryOptions: <TData = Awaited<ReturnType<typeof listDistricts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDistricts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listDistricts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListDistrictsQueryResult = NonNullable<Awaited<ReturnType<typeof listDistricts>>>;
export type ListDistrictsQueryError = ErrorType<unknown>;
/**
 * @summary List district intelligence snapshots
 */
export declare function useListDistricts<TData = Awaited<ReturnType<typeof listDistricts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDistricts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDistrictIntelligenceUrl: (district: string) => string;
/**
 * @summary Get one district intelligence snapshot
 */
export declare const getDistrictIntelligence: (district: string, options?: Parameters<typeof customFetch>[1]) => Promise<DistrictIntelligence>;
export declare const getGetDistrictIntelligenceQueryKey: (district: string) => readonly [`/api/districts/${string}`];
export declare const getGetDistrictIntelligenceQueryOptions: <TData = Awaited<ReturnType<typeof getDistrictIntelligence>>, TError = ErrorType<unknown>>(district: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDistrictIntelligence>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDistrictIntelligence>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDistrictIntelligenceQueryResult = NonNullable<Awaited<ReturnType<typeof getDistrictIntelligence>>>;
export type GetDistrictIntelligenceQueryError = ErrorType<unknown>;
/**
 * @summary Get one district intelligence snapshot
 */
export declare function useGetDistrictIntelligence<TData = Awaited<ReturnType<typeof getDistrictIntelligence>>, TError = ErrorType<unknown>>(district: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDistrictIntelligence>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListSkillDemandUrl: (params?: ListSkillDemandParams) => string;
/**
 * @summary List current skill demand
 */
export declare const listSkillDemand: (params?: ListSkillDemandParams, options?: Parameters<typeof customFetch>[1]) => Promise<SkillDemand[]>;
export declare const getListSkillDemandQueryKey: (params?: ListSkillDemandParams) => readonly ["/api/skill-demand", ...ListSkillDemandParams[]];
export declare const getListSkillDemandQueryOptions: <TData = Awaited<ReturnType<typeof listSkillDemand>>, TError = ErrorType<unknown>>(params?: ListSkillDemandParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSkillDemand>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSkillDemand>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSkillDemandQueryResult = NonNullable<Awaited<ReturnType<typeof listSkillDemand>>>;
export type ListSkillDemandQueryError = ErrorType<unknown>;
/**
 * @summary List current skill demand
 */
export declare function useListSkillDemand<TData = Awaited<ReturnType<typeof listSkillDemand>>, TError = ErrorType<unknown>>(params?: ListSkillDemandParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSkillDemand>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSkillForecastUrl: () => string;
/**
 * @summary Get future skill demand forecast
 */
export declare const getSkillForecast: (options?: Parameters<typeof customFetch>[1]) => Promise<Forecast[]>;
export declare const getGetSkillForecastQueryKey: () => readonly ["/api/forecast"];
export declare const getGetSkillForecastQueryOptions: <TData = Awaited<ReturnType<typeof getSkillForecast>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSkillForecast>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSkillForecast>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSkillForecastQueryResult = NonNullable<Awaited<ReturnType<typeof getSkillForecast>>>;
export type GetSkillForecastQueryError = ErrorType<unknown>;
/**
 * @summary Get future skill demand forecast
 */
export declare function useGetSkillForecast<TData = Awaited<ReturnType<typeof getSkillForecast>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSkillForecast>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetTraineeUrl: (traineeId: string) => string;
/**
 * @summary Get trainee profile
 */
export declare const getTrainee: (traineeId: string, options?: Parameters<typeof customFetch>[1]) => Promise<Trainee>;
export declare const getGetTraineeQueryKey: (traineeId: string) => readonly [`/api/trainees/${string}`];
export declare const getGetTraineeQueryOptions: <TData = Awaited<ReturnType<typeof getTrainee>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrainee>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTrainee>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTraineeQueryResult = NonNullable<Awaited<ReturnType<typeof getTrainee>>>;
export type GetTraineeQueryError = ErrorType<unknown>;
/**
 * @summary Get trainee profile
 */
export declare function useGetTrainee<TData = Awaited<ReturnType<typeof getTrainee>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrainee>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateTraineeUrl: (traineeId: string) => string;
/**
 * @summary Update trainee profile
 */
export declare const updateTrainee: (traineeId: string, traineeUpdate: TraineeUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Trainee>;
export declare const getUpdateTraineeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTrainee>>, TError, {
        traineeId: string;
        data: BodyType<TraineeUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTrainee>>, TError, {
    traineeId: string;
    data: BodyType<TraineeUpdate>;
}, TContext>;
export type UpdateTraineeMutationResult = NonNullable<Awaited<ReturnType<typeof updateTrainee>>>;
export type UpdateTraineeMutationBody = BodyType<TraineeUpdate>;
export type UpdateTraineeMutationError = ErrorType<unknown>;
/**
* @summary Update trainee profile
*/
export declare const useUpdateTrainee: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTrainee>>, TError, {
        traineeId: string;
        data: BodyType<TraineeUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTrainee>>, TError, {
    traineeId: string;
    data: BodyType<TraineeUpdate>;
}, TContext>;
export declare const getListJobsUrl: (params?: ListJobsParams) => string;
/**
 * @summary List recommended and open jobs
 */
export declare const listJobs: (params?: ListJobsParams, options?: Parameters<typeof customFetch>[1]) => Promise<Job[]>;
export declare const getListJobsQueryKey: (params?: ListJobsParams) => readonly ["/api/jobs", ...ListJobsParams[]];
export declare const getListJobsQueryOptions: <TData = Awaited<ReturnType<typeof listJobs>>, TError = ErrorType<unknown>>(params?: ListJobsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListJobsQueryResult = NonNullable<Awaited<ReturnType<typeof listJobs>>>;
export type ListJobsQueryError = ErrorType<unknown>;
/**
 * @summary List recommended and open jobs
 */
export declare function useListJobs<TData = Awaited<ReturnType<typeof listJobs>>, TError = ErrorType<unknown>>(params?: ListJobsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateJobUrl: () => string;
/**
 * @summary Create a job posting
 */
export declare const createJob: (jobInput: JobInput, options?: Parameters<typeof customFetch>[1]) => Promise<Job>;
export declare const getCreateJobMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createJob>>, TError, {
        data: BodyType<JobInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createJob>>, TError, {
    data: BodyType<JobInput>;
}, TContext>;
export type CreateJobMutationResult = NonNullable<Awaited<ReturnType<typeof createJob>>>;
export type CreateJobMutationBody = BodyType<JobInput>;
export type CreateJobMutationError = ErrorType<unknown>;
/**
* @summary Create a job posting
*/
export declare const useCreateJob: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createJob>>, TError, {
        data: BodyType<JobInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createJob>>, TError, {
    data: BodyType<JobInput>;
}, TContext>;
export declare const getApplyToJobUrl: (jobId: string) => string;
/**
 * @summary Apply to a job
 */
export declare const applyToJob: (jobId: string, jobApplicationInput: JobApplicationInput, options?: Parameters<typeof customFetch>[1]) => Promise<JobApplication>;
export declare const getApplyToJobMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyToJob>>, TError, {
        jobId: string;
        data: BodyType<JobApplicationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof applyToJob>>, TError, {
    jobId: string;
    data: BodyType<JobApplicationInput>;
}, TContext>;
export type ApplyToJobMutationResult = NonNullable<Awaited<ReturnType<typeof applyToJob>>>;
export type ApplyToJobMutationBody = BodyType<JobApplicationInput>;
export type ApplyToJobMutationError = ErrorType<unknown>;
/**
* @summary Apply to a job
*/
export declare const useApplyToJob: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyToJob>>, TError, {
        jobId: string;
        data: BodyType<JobApplicationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof applyToJob>>, TError, {
    jobId: string;
    data: BodyType<JobApplicationInput>;
}, TContext>;
export declare const getGetJobMatchesUrl: (traineeId: string) => string;
/**
 * @summary Get ranked job matches for a trainee
 */
export declare const getJobMatches: (traineeId: string, options?: Parameters<typeof customFetch>[1]) => Promise<JobMatch[]>;
export declare const getGetJobMatchesQueryKey: (traineeId: string) => readonly [`/api/job-matches/${string}`];
export declare const getGetJobMatchesQueryOptions: <TData = Awaited<ReturnType<typeof getJobMatches>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getJobMatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getJobMatches>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetJobMatchesQueryResult = NonNullable<Awaited<ReturnType<typeof getJobMatches>>>;
export type GetJobMatchesQueryError = ErrorType<unknown>;
/**
 * @summary Get ranked job matches for a trainee
 */
export declare function useGetJobMatches<TData = Awaited<ReturnType<typeof getJobMatches>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getJobMatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListSkillsUrl: () => string;
/**
 * @summary List skills in the taxonomy
 */
export declare const listSkills: (options?: Parameters<typeof customFetch>[1]) => Promise<Skill[]>;
export declare const getListSkillsQueryKey: () => readonly ["/api/skills"];
export declare const getListSkillsQueryOptions: <TData = Awaited<ReturnType<typeof listSkills>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSkills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSkills>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSkillsQueryResult = NonNullable<Awaited<ReturnType<typeof listSkills>>>;
export type ListSkillsQueryError = ErrorType<unknown>;
/**
 * @summary List skills in the taxonomy
 */
export declare function useListSkills<TData = Awaited<ReturnType<typeof listSkills>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSkills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListTrainingProgramsUrl: () => string;
/**
 * @summary List training programs
 */
export declare const listTrainingPrograms: (options?: Parameters<typeof customFetch>[1]) => Promise<TrainingProgram[]>;
export declare const getListTrainingProgramsQueryKey: () => readonly ["/api/training-programs"];
export declare const getListTrainingProgramsQueryOptions: <TData = Awaited<ReturnType<typeof listTrainingPrograms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrainingPrograms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTrainingPrograms>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTrainingProgramsQueryResult = NonNullable<Awaited<ReturnType<typeof listTrainingPrograms>>>;
export type ListTrainingProgramsQueryError = ErrorType<unknown>;
/**
 * @summary List training programs
 */
export declare function useListTrainingPrograms<TData = Awaited<ReturnType<typeof listTrainingPrograms>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrainingPrograms>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateTrainingProgramUrl: () => string;
/**
 * @summary Create a training program
 */
export declare const createTrainingProgram: (trainingProgramInput: TrainingProgramInput, options?: Parameters<typeof customFetch>[1]) => Promise<TrainingProgram>;
export declare const getCreateTrainingProgramMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTrainingProgram>>, TError, {
        data: BodyType<TrainingProgramInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTrainingProgram>>, TError, {
    data: BodyType<TrainingProgramInput>;
}, TContext>;
export type CreateTrainingProgramMutationResult = NonNullable<Awaited<ReturnType<typeof createTrainingProgram>>>;
export type CreateTrainingProgramMutationBody = BodyType<TrainingProgramInput>;
export type CreateTrainingProgramMutationError = ErrorType<unknown>;
/**
* @summary Create a training program
*/
export declare const useCreateTrainingProgram: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTrainingProgram>>, TError, {
        data: BodyType<TrainingProgramInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTrainingProgram>>, TError, {
    data: BodyType<TrainingProgramInput>;
}, TContext>;
export declare const getGetTraineeRecommendationsUrl: (traineeId: string) => string;
/**
 * @summary Get personalized recommendations
 */
export declare const getTraineeRecommendations: (traineeId: string, options?: Parameters<typeof customFetch>[1]) => Promise<Recommendation[]>;
export declare const getGetTraineeRecommendationsQueryKey: (traineeId: string) => readonly [`/api/recommendations/${string}`];
export declare const getGetTraineeRecommendationsQueryOptions: <TData = Awaited<ReturnType<typeof getTraineeRecommendations>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTraineeRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTraineeRecommendations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTraineeRecommendationsQueryResult = NonNullable<Awaited<ReturnType<typeof getTraineeRecommendations>>>;
export type GetTraineeRecommendationsQueryError = ErrorType<unknown>;
/**
 * @summary Get personalized recommendations
 */
export declare function useGetTraineeRecommendations<TData = Awaited<ReturnType<typeof getTraineeRecommendations>>, TError = ErrorType<unknown>>(traineeId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTraineeRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCareerAdviceUrl: () => string;
/**
 * @summary Ask the career assistant
 */
export declare const getCareerAdvice: (careerAdviceInput: CareerAdviceInput, options?: Parameters<typeof customFetch>[1]) => Promise<CareerAdvice>;
export declare const getGetCareerAdviceMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof getCareerAdvice>>, TError, {
        data: BodyType<CareerAdviceInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof getCareerAdvice>>, TError, {
    data: BodyType<CareerAdviceInput>;
}, TContext>;
export type GetCareerAdviceMutationResult = NonNullable<Awaited<ReturnType<typeof getCareerAdvice>>>;
export type GetCareerAdviceMutationBody = BodyType<CareerAdviceInput>;
export type GetCareerAdviceMutationError = ErrorType<unknown>;
/**
* @summary Ask the career assistant
*/
export declare const useGetCareerAdvice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof getCareerAdvice>>, TError, {
        data: BodyType<CareerAdviceInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof getCareerAdvice>>, TError, {
    data: BodyType<CareerAdviceInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map