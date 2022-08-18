import {
  gql
} from '@apollo/client';

export const GET_COMMENTS = gql `
query comments($task: Int!, $page: Int, $limit: Int, $fromInvoice: Boolean){
	comments(
		task: $task
    page: $page
    limit: $limit
    fromInvoice: $fromInvoice
	){
    id
    messageCount
    createdAt
    internal
    isEmail
    message
    html
    subject
    tos
    emailSend
    emailError
    user{
      id
      fullName
      email
    }
    commentAttachments{
      id
      path
      filename
      size
      mimetype
    }
    childComments {
      id
      createdAt
      internal
      isEmail
      message
      html
      subject
      tos
      emailSend
      emailError
      user{
        id
        fullName
        email
      }
      commentAttachments{
      id
      path
      filename
      size
      mimetype
      }
    }
  }
}
`;

export const COMMENTS_SUBSCRIPTION = gql `
  subscription commentsSubscription( $taskId: Int! ) {
    commentsSubscription( taskId: $taskId )
  }
`;
