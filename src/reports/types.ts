export interface CreateReportData {
  start_date: Date;
  end_date: Date;
  file_url?: string;
  report_type_id: number;
  user_id?: number; // Optional, will be set from JWT token
}

export interface UpdateReportData {
  start_date?: Date;
  end_date?: Date;
  file_url?: string;
  report_type_id?: number;
}

export interface ReportResponse {
  id: number;
  start_date: Date;
  end_date: Date;
  file_url: string;
  created_at: Date;
  report_type_id: number;
  user_id: number;
  reportType?: {
    id: number;
    name: string;
  };
  // Calculated fields
  period_days?: number;
  is_ready?: boolean;
  file_size?: string;
}

export interface ReportGenerationRequest {
  start_date: Date;
  end_date: Date;
  report_type_id: number;
  include_transactions?: boolean;
  include_budgets?: boolean;
  include_analytics?: boolean;
  format?: 'PDF' | 'Excel' | 'CSV';
}

export interface ReportFilters {
  start_date?: Date;
  end_date?: Date;
  report_type_id?: number;
  is_ready?: boolean;
}
