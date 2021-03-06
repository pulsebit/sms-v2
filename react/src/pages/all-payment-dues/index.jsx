import React, { useEffect, useState } from 'react'
import Box from 'components/Box'
import { TableWrapper } from 'styled';
import { useHttp, useQuery } from 'hooks'
import moment from 'moment'
import { Link, useHistory } from 'react-router-dom'
import { DatePicker } from 'components/Forms'

export const Index = () => {
  const http = useHttp()
  const [lists, setLists] = React.useState(null)
  const query = useQuery();
  const duesQuery = query.toString();

  useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        const { data } = await http.get('/api/student/payment/all-payment-dues?' + duesQuery)
        if (unmount) setLists(data)
      })()
    }
    return () => unmount = false
  }, [duesQuery])
  
  return (
    <Wrapper>
      {lists ? (
          lists.map((doc, key) => <List key={key} doc={doc} />)
        ) : (
          <Waiting message="Loading..." />
        )
      }
      {lists && !lists.length && <Waiting message="No Records found." />}
    </Wrapper>
  )
}

export default Index

const Waiting = ({ message }) => (
  <tr>
    <td colSpan="6" className="text-center">{message}</td>
  </tr>
)

const List = ({ doc }) => {
  const history = useHistory()
  return (
    <tr title="View">
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {doc.student && doc.student.first_name + ' ' + doc.student.last_name }<br/>
        <span style={{ fontSize: '0.8em' }}>{doc.student && doc.student.email}</span>
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
        >
          {doc.plan && doc.plan.resultName}
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {moment(doc.due_date || new Date()).format('ll')}
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {doc.amount.$numberDecimal} {doc.currency}
      </td>
      <td 
        onClick={() => history.push(`/student/${doc.student._id}#/payment-lists`)}
      >
        {doc.status}
      </td>
      <td>
        <Link
          to={`/student/${doc.student._id}#/payment-lists`} 
          className="btn btn-sm btn-outline-primary"
          >View
        </Link>
      </td>
    </tr>
  )
}


const Wrapper = ({ children }) => {
  const query = useQuery();
  const [dueFromDate, setDueFromDate] = useState(null);
  const [dueToDate, setDueToDate] = useState(null);
  const history = useHistory();

  const duesQuery = () => {
    if (!query.get('dues')) return;
    const [from, to] = query.get('dues').split('~');
    return { from, to };
  }

  const onFilter = () => {
    if (!dueFromDate && !dueToDate){
      history.push('?'); 
    } else {
      query.set('dues', `${dueFromDate}~${dueToDate}`);
      history.push('?' + query.toString()); 
    }   
    
  }

  const disabledBtn = () => {
    // if (!dueFromDate || !dueToDate) {
    //   return true;
    // }
    // return moment(dueFromDate).isSameOrAfter(dueToDate, 'day');
  }

  return (
    <Box 
      title={<>
          All Payment Dues
          {duesQuery() ? (
            <div style={{ fontSize: '0.65em', fontWeight: '400' }}>
              All payment dues from <strong>{moment(duesQuery().from).format('MMM DD, YYYY')}</strong> to <strong>{moment(duesQuery().to).format('MMM DD, YYYY')}</strong>
            </div>
          ) : (
            <div style={{ fontSize: '0.65em', fontWeight: '400' }}>
              All payment dues that is within 7 days will show up here
            </div>
          )}
        </>} 
      hasBackBtn={false}
      maxWidth="100%"
      rightHeader={(
        <div className="d-flex">
          <span className="mr-2">
            <DatePicker placeholder="From" className="form-control" 
              onChange={(date, dateString) => setDueFromDate(dateString)}
            />
          </span>
          <span className="mr-2">
            <DatePicker placeholder="To" className="form-control" 
              onChange={(date, dateString) => setDueToDate(dateString)}
            />
          </span>
          <button type="button" className="btn btn-primary btn-sm"
            onClick={onFilter}
            disabled={disabledBtn()}
          >Filter</button>
        </div>
      )}
    >
      <div className="py-3">
        <TableWrapper className="table-responsive">
          <table className="table mb-0">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Payment Plan</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {children}
            </tbody>
          </table>
        </TableWrapper>
      </div>
  </Box>
  )
}
