import {
  gql
} from '@apollo/client';

const materialData = `
  id
  title
  order
  done
  approved
  approvedBy{
    id
    fullName
  }
  quantity
  margin
  price
`;

export const ADD_MATERIAL = gql `
mutation addMaterial($title: String!, $order: Int!, $done: Boolean!, $approved: Boolean, $quantity: Float!, $margin: Float!, $price: Float!, $task: Int!, $fromInvoice: Boolean) {
  addMaterial(
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    margin: $margin,
    price: $price,
    task: $task,
    fromInvoice: $fromInvoice
  ){
    ${materialData}
  }
}
`;

export const UPDATE_MATERIAL = gql `
mutation updateMaterial($id: Int!, $title: String, $order: Int, $done: Boolean, $approved: Boolean, $quantity: Float, $margin: Float, $price: Float, $fromInvoice: Boolean) {
  updateMaterial(
    id: $id,
    title: $title,
    order: $order,
    done: $done,
    approved: $approved,
    quantity: $quantity,
    margin: $margin,
    price: $price,
    fromInvoice: $fromInvoice
  ){
    ${materialData}
  }
}
`;

export const DELETE_MATERIAL = gql `
mutation deleteMaterial($id: Int!, $fromInvoice: Boolean) {
  deleteMaterial(
    id: $id,
    fromInvoice: $fromInvoice
  ){
    id
  }
}
`;
