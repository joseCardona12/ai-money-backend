export interface CreateReportTypeData {
  name: string;
}

export interface UpdateReportTypeData {
  name?: string;
}

export interface ReportTypeResponse {
  id: number;
  name: string;
}
