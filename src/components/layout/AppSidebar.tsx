import { SurveyPanel } from '../survey/SurveyPanel';
import { SurveySummary } from '../survey/SurveySummary';

export function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <SurveyPanel />
      <SurveySummary />
    </aside>
  );
}
