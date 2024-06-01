import React, { useEffect, useState } from "react";
import ticketsService from "../service/tickets.service";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Table,
} from "reactstrap";
import { useForm } from "react-hook-form";

export default function Tickets() {
  const [TicketData, setTicketData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [ModalAdd, setModalAdd] = useState(false);
  const [ModalApprove, setModalApprove] = useState(false);
  const [Approve, setApprove] = useState(false);

  const [TicketDetail, setTicketDetail] = useState();
  const [CustomerName, setCustomerName] = useState();

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };
  const paginatedData = TicketData.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  const [dataUpdate, setDataUpdate] = useState();
  const [IdTicket, setIdTicket] = useState();

  useEffect(() => {
    getById(IdTicket);
  }, [IdTicket]);

  async function getById(id) {
    try {
      const response = await ticketsService.get(id);
      setDataUpdate(response.data[id]);
    } catch {}
  }

  const handleApprove = (id) => {
    setModalApprove(true);
    setIdTicket(id);
    getById(id);
  };

  const handleSubmitApprove = () => {
    setApprove(true);
    update(IdTicket, dataUpdate);
  };

  const handleReject = () => {
    setApprove(false);
    update(IdTicket, dataUpdate);
  };

  async function update(id, dataUpdate) {
    try {
      const dataInput = [...dataUpdate];
      dataInput.append("is_approve", Approve);

      await ticketsService.update(id, dataInput);
      setModalApprove(false);
    } catch {}
  }

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await ticketsService.getAll();
      setTicketData(response.data);
    } catch (error) {
      console.error("Failed to fetch overview data: ", error);
    }
  }

  const { handleSubmit } = useForm({
    defaultValues: {
      TicketDetail: "",
      CustomerName: "",
      Priority: "Normal",
    },
  });

  const onSubmit = () => {
    const data = {
      ticket_details: TicketDetail,
      customer_name: CustomerName,
      priority: "Normal",
    };

    ticketsService
      .create(data)
      .then(() => {
        setModalAdd(false);
        getData();
      })
      .catch((error) => {});
  };

  const TicketList =
    paginatedData &&
    paginatedData.map((t) => {
      return (
        <tr key={t.id}>
          <td>{t.id}</td>
          <td>{t.ticket_details}</td>
          <td>{t.customer_name}</td>
          <td>{t.createdAt}</td>
          <td>
            <span
              className={
                t.priority === "High"
                  ? "high"
                  : t.priority === "Normal"
                  ? "normal"
                  : "low"
              }
            >
              {t.priority}
            </span>
          </td>
          <td>
            <button
              type="btn"
              className="btn-approve"
              onClick={() => handleApprove(t.id)}
            >
              Approve
            </button>
          </td>
        </tr>
      );
    });
  return (
    <div className="ticket-app">
      <div>
        <h1>Ticket</h1>
        <Button className="btn-add" onClick={() => setModalAdd(true)}>
          Add Ticket
        </Button>
      </div>
      <Table className="table-ticket">
        <thead>
          <tr>
            <th>No</th>
            <th>Tickets Detail</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Priority</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>{TicketList}</tbody>
      </Table>
      {TicketData && TicketData.length <= 0 && <span>Data Kosong</span>}
      <div className="pagination">
        {Array(Math.ceil(TicketData.length / perPage))
          .fill()
          .map((_, idx) => (
            <Button key={idx} onClick={(e) => handleChangePage(e, idx)}>
              {idx + 1}
            </Button>
          ))}
      </div>
      <div className="rows-perpage">
        <label>Rows per page:</label>
        <select value={perPage} onChange={handleChangeRowsPerPage}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <Modal
        isOpen={ModalAdd}
        backdrop={true}
        centered={true}
        fade={false}
        className="modal"
        toggle={() => setModalAdd(false)}
      >
        <ModalBody className="modal-body">
          <h3>Add New Ticket</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup className="input-group">
              <Label>Ticket Detail</Label>
              <Input
                type="text"
                name="TicketDetail"
                onChange={(e) => setTicketDetail(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="input-group">
              <Label>Customer Name</Label>
              <Input
                type="text"
                name="CustomerName"
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </FormGroup>
            <button type="submit" className="btn-submit">
              Save
            </button>
            <button
              type="btn"
              className="btn-close"
              onClick={() => setModalAdd(false)}
            >
              Close
            </button>
          </form>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={ModalApprove}
        backdrop={true}
        centered={true}
        fade={false}
        className="modal"
        toggle={() => setModalAdd(false)}
      >
        <ModalBody className="modal-body">
          <button
            className="btn-submit"
            onClick={() => {
              handleSubmitApprove();
              setModalApprove(false);
            }}
          >
            Approve
          </button>
          <button
            className="btn-close"
            onClick={() => {
              handleReject();
              setModalApprove(false);
            }}
          >
            Reject
          </button>
        </ModalBody>
      </Modal>
    </div>
  );
}
