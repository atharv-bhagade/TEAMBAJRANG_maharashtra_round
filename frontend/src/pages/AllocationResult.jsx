import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import AllocationView from '../features/allocation/AllocationView'
import { useAllocation } from '../hooks/useAllocation'
import { useMockState } from '../hooks/useMockState'

export default function AllocationResult() {
  const navigate = useNavigate()
  const { drop } = useMockState()
  const { allocation, user } = useAllocation()
  const remainingEntitlement = Math.max(0, drop.maxTicketsPerUser - user.ticketsOwned)

  return (
    <PageContainer narrow demo>
      <div className="fd-fade-up">
        <AllocationView
          allocation={allocation}
          drop={drop}
          user={user}
          remainingEntitlement={remainingEntitlement}
          onTryAgain={() => navigate('/queue')}
        />
      </div>
    </PageContainer>
  )
}
