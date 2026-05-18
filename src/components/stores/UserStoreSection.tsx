import { TabPanel } from '../ui/TabPanel';
import { UserStoreList } from './UserStoreList';
import { StoreRequestForm } from '../storeRequests/StoreRequestForm';
import { MyRequestList } from '../storeRequests/MyRequestList';

export function UserStoreSection() {
  return (
    <section className="racer-management" id="userFoodSection">
      <h2>Quan an</h2>
      <TabPanel
        tabs={[
          { label: 'Danh sach quan an', content: <UserStoreList /> },
          { label: 'Request quan an moi', content: <StoreRequestForm /> },
          { label: 'Danh sach da request', content: <MyRequestList /> },
        ]}
      />
    </section>
  );
}
