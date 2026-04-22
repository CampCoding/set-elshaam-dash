import axiosInstance from "../axios";
import { ADMIN_TICKETS_ENDPOINTS } from "../endpoints";

export const ticketsService = {
  getTickets: async () => {
    const response = await axiosInstance.get(ADMIN_TICKETS_ENDPOINTS.GET_TICKETS);
    return response.data;
  },

  getTicketDetails: async (id) => {
    const response = await axiosInstance.get(
      ADMIN_TICKETS_ENDPOINTS.GET_TICKET_DETAILS(id)
    );
    return response.data;
  },

  replyTicket: async (id, data) => {
    // data can be FormData if it has attachments
    const response = await axiosInstance.post(
      ADMIN_TICKETS_ENDPOINTS.REPLY_TICKET(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  closeTicket: async (id) => {
    const response = await axiosInstance.patch(
      ADMIN_TICKETS_ENDPOINTS.CLOSE_TICKET(id)
    );
    return response.data;
  },
};
