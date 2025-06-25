import { DataTable } from 'react-native-paper'

interface TicketItem {
  _id: string;
  ticketId: string;
  ticketName: string;
  ticketType: string;
}

interface TicketDataProps {
  data: TicketItem[];
}
const TicketDataList: React.FC<TicketDataProps> = ({ data }) => {
  return (

    <DataTable>
      <DataTable.Header style={{ backgroundColor: '#dddddd', boxShadow: 'md' }} className="shadow-md rounded-md" >
        <DataTable.Title style={{ flex: 1, justifyContent: 'flex-start' }} textStyle={{ color: "black" }} >Id</DataTable.Title>
        <DataTable.Title style={{ flex: 1.5, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Id Phiếu</DataTable.Title>
        {/* <DataTable.Title style={{ flex: 1, justifyContent: 'center' }} textStyle={{ color: "black" }}>Loại Phiếu</DataTable.Title> */}
        <DataTable.Title style={{ flex: 1.5, justifyContent: 'flex-end' }} textStyle={{ color: "black" }}>Tên Phiếu</DataTable.Title>
      </DataTable.Header>

      {data.map((item) => (
        <DataTable.Row key={item._id}>
          <DataTable.Cell style={{ flex: 1, justifyContent: 'flex-start' }} textStyle={{ color: "gray" }}>{item._id}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-end' }} textStyle={{ color: "gray" }}>{item.ticketId}</DataTable.Cell>
          {/* <DataTable.Cell style={{ flex: 1, justifyContent: 'center' }} textStyle={{ color: "gray" }}>{item.ticketType}</DataTable.Cell> */}
          <DataTable.Cell style={{ flex: 1.5, justifyContent: 'flex-end' }} textStyle={{ color: "gray" }}>{item.ticketName}</DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  )
}

export default TicketDataList;
