import ticketModel from '../dao/models/ticket.model.js';
export class TicketRepository {
  create(data) { return ticketModel.create(data); }
  findByCode(code) { return ticketModel.findOne({ code }); }
}
