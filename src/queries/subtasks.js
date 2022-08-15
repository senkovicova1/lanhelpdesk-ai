import {
  gql
} from '@apollo/client';

const subtaskData = `
  id
  title
  order
  done
  approved
  price
  approvedBy{
    id
    fullName
  }
  quantity
  discount
  assignedTo {
    id
    fullName
    email
    company {
      id
    }
  }
  scheduled {
    from
    to
  }
`;

export const ADD_SUBTASK = gql `
mutation addSubtask($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $discount: Float!, $task: Int!, $assignedTo: Int!, $scheduled: ScheduledWorkInput, $fromInvoice: Boolean ) {
  addSubtask(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    task: $task,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
    fromInvoice: $fromInvoice
  ){
    ${subtaskData}
  }
}
`;

export const UPDATE_SUBTASK = gql `
mutation updateSubtask($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $discount: Float, $assignedTo: Int, $scheduled: ScheduledWorkInput, $fromInvoice: Boolean) {
  updateSubtask(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    discount: $discount,
    assignedTo: $assignedTo,
    scheduled: $scheduled,
    fromInvoice: $fromInvoice
  ){
    ${subtaskData}
  }
}
`;

export const DELETE_SUBTASK = gql `
mutation deleteSubtask($id: Int!, $fromInvoice: Boolean) {
  deleteSubtask(
    id: $id,
    fromInvoice: $fromInvoice
  ){
    id
  }
}
`;
