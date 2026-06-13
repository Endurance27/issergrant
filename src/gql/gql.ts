/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment UserFields on User {\n    id\n    authUserId\n    name\n    email\n    role\n    status\n    department\n    staffId\n    phoneContact\n    avatar\n    lastLogin\n    createdAt\n    updatedAt\n  }\n": typeof types.UserFieldsFragmentDoc,
    "\n  \n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  \n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      ...UserFields\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation UpdateUserStatus($input: UserStatusInput!) {\n    updateUserStatus(input: $input) {\n      id\n      status\n    }\n  }\n": typeof types.UpdateUserStatusDocument,
    "\n  mutation SignIn($content: SignInContent) {\n    signIn(content: $content) {\n      accessToken\n      account_type\n      email\n      id\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation BookmarkGrantCall(\n    $fundingCallId: ID!\n    $userID: ID!\n    $notes: String\n  ) {\n    bookmarkGrantCall(\n      fundingCallId: $fundingCallId\n      userID: $userID\n      notes: $notes\n    ) {\n      success\n      message\n      grantCall {\n        id\n        title\n        description\n        category\n        totalBudget\n        deadline\n        eligibility\n        status\n        applicationCount\n        isBookmarked\n        bookmarkNotes\n      }\n      bookmark {\n        id\n        userID\n        fundingCallId\n        fundingCallTitle\n        notes\n        bookmarkedAt\n      }\n    }\n  }\n": typeof types.BookmarkGrantCallDocument,
    "\n  mutation CreateFundingCall($content: CreateFundingCallInput!) {\n    createFundingCall(content: $content) {\n      id\n      funder\n      theme\n      totalAvailable\n      maximumAward\n      minimumAward\n      hasMinMaxAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n    }\n  }\n": typeof types.CreateFundingCallDocument,
    "\n  mutation UpdateFundingCall($content: UpdateFundingCallInput!) {\n    updateFundingCall(content: $content) {\n      id\n      funder\n      totalAvailable\n      maximumAward\n      theme\n      description\n      hasMinMaxAward\n      minimumAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateFundingCallDocument,
    "\n  mutation CreateProposal($input: CreateProposalInput!) {\n    createProposal(input: $input) {\n      success\n      message\n      errors\n      proposal {\n        id\n        title\n        abstract\n        userID\n        fundingCallId\n        fundingCallTitle\n        status\n        requestedAmount\n        department\n        submitted\n\n        user {\n          id\n          authUserId\n          name\n          email\n          role\n          status\n          department\n          staffId\n          phoneContact\n          avatar\n          lastLogin\n          createdAt\n          updatedAt\n        }\n\n        fundingCall {\n          id\n          funder\n          totalAvailable\n          maximumAward\n          theme\n          description\n          hasMinMaxAward\n          minimumAward\n          allowsMultipleApplications\n          openDate\n          originalCallLink\n          eligibility\n          createdBy\n          createdAt\n          updatedAt\n        }\n      }\n    }\n  }\n": typeof types.CreateProposalDocument,
    "\n  \n  mutation SignUpAssistantResearcher($content: CreateAssistantUserContent!) {\n    signUpAssistantResearcher(content: $content) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n": typeof types.SignUpAssistantResearcherDocument,
    "\n  query GetUsers {\n    getUsers {\n      users {\n        id\n        authUserId\n        name\n        email\n        role\n        status\n        department\n        staffId\n        phoneContact\n        avatar\n        lastLogin\n        createdAt\n        updatedAt\n      }\n      totalCount\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  query GetGrantCalls(\n    $search: String\n    $status: String\n    $category: String\n    $limit: Int\n    $offset: Int\n    $userID: ID\n  ) {\n    grantCalls(\n      search: $search\n      status: $status\n      category: $category\n      limit: $limit\n      offset: $offset\n      userID: $userID\n    ) {\n      edges {\n        node {\n          id\n          title\n          description\n          category\n          totalBudget\n          deadline\n          eligibility\n          status\n          applicationCount\n          isBookmarked\n          bookmarkNotes\n        }\n      }\n      totalCount\n    }\n  }\n": typeof types.GetGrantCallsDocument,
};
const documents: Documents = {
    "\n  fragment UserFields on User {\n    id\n    authUserId\n    name\n    email\n    role\n    status\n    department\n    staffId\n    phoneContact\n    avatar\n    lastLogin\n    createdAt\n    updatedAt\n  }\n": types.UserFieldsFragmentDoc,
    "\n  \n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n": types.CreateUserDocument,
    "\n  \n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      ...UserFields\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation UpdateUserStatus($input: UserStatusInput!) {\n    updateUserStatus(input: $input) {\n      id\n      status\n    }\n  }\n": types.UpdateUserStatusDocument,
    "\n  mutation SignIn($content: SignInContent) {\n    signIn(content: $content) {\n      accessToken\n      account_type\n      email\n      id\n    }\n  }\n": types.SignInDocument,
    "\n  mutation BookmarkGrantCall(\n    $fundingCallId: ID!\n    $userID: ID!\n    $notes: String\n  ) {\n    bookmarkGrantCall(\n      fundingCallId: $fundingCallId\n      userID: $userID\n      notes: $notes\n    ) {\n      success\n      message\n      grantCall {\n        id\n        title\n        description\n        category\n        totalBudget\n        deadline\n        eligibility\n        status\n        applicationCount\n        isBookmarked\n        bookmarkNotes\n      }\n      bookmark {\n        id\n        userID\n        fundingCallId\n        fundingCallTitle\n        notes\n        bookmarkedAt\n      }\n    }\n  }\n": types.BookmarkGrantCallDocument,
    "\n  mutation CreateFundingCall($content: CreateFundingCallInput!) {\n    createFundingCall(content: $content) {\n      id\n      funder\n      theme\n      totalAvailable\n      maximumAward\n      minimumAward\n      hasMinMaxAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n    }\n  }\n": types.CreateFundingCallDocument,
    "\n  mutation UpdateFundingCall($content: UpdateFundingCallInput!) {\n    updateFundingCall(content: $content) {\n      id\n      funder\n      totalAvailable\n      maximumAward\n      theme\n      description\n      hasMinMaxAward\n      minimumAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateFundingCallDocument,
    "\n  mutation CreateProposal($input: CreateProposalInput!) {\n    createProposal(input: $input) {\n      success\n      message\n      errors\n      proposal {\n        id\n        title\n        abstract\n        userID\n        fundingCallId\n        fundingCallTitle\n        status\n        requestedAmount\n        department\n        submitted\n\n        user {\n          id\n          authUserId\n          name\n          email\n          role\n          status\n          department\n          staffId\n          phoneContact\n          avatar\n          lastLogin\n          createdAt\n          updatedAt\n        }\n\n        fundingCall {\n          id\n          funder\n          totalAvailable\n          maximumAward\n          theme\n          description\n          hasMinMaxAward\n          minimumAward\n          allowsMultipleApplications\n          openDate\n          originalCallLink\n          eligibility\n          createdBy\n          createdAt\n          updatedAt\n        }\n      }\n    }\n  }\n": types.CreateProposalDocument,
    "\n  \n  mutation SignUpAssistantResearcher($content: CreateAssistantUserContent!) {\n    signUpAssistantResearcher(content: $content) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n": types.SignUpAssistantResearcherDocument,
    "\n  query GetUsers {\n    getUsers {\n      users {\n        id\n        authUserId\n        name\n        email\n        role\n        status\n        department\n        staffId\n        phoneContact\n        avatar\n        lastLogin\n        createdAt\n        updatedAt\n      }\n      totalCount\n    }\n  }\n": types.GetUsersDocument,
    "\n  query GetGrantCalls(\n    $search: String\n    $status: String\n    $category: String\n    $limit: Int\n    $offset: Int\n    $userID: ID\n  ) {\n    grantCalls(\n      search: $search\n      status: $status\n      category: $category\n      limit: $limit\n      offset: $offset\n      userID: $userID\n    ) {\n      edges {\n        node {\n          id\n          title\n          description\n          category\n          totalBudget\n          deadline\n          eligibility\n          status\n          applicationCount\n          isBookmarked\n          bookmarkNotes\n        }\n      }\n      totalCount\n    }\n  }\n": types.GetGrantCallsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserFields on User {\n    id\n    authUserId\n    name\n    email\n    role\n    status\n    department\n    staffId\n    phoneContact\n    avatar\n    lastLogin\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    authUserId\n    name\n    email\n    role\n    status\n    department\n    staffId\n    phoneContact\n    avatar\n    lastLogin\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  \n  mutation UpdateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      ...UserFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserStatus($input: UserStatusInput!) {\n    updateUserStatus(input: $input) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserStatus($input: UserStatusInput!) {\n    updateUserStatus(input: $input) {\n      id\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignIn($content: SignInContent) {\n    signIn(content: $content) {\n      accessToken\n      account_type\n      email\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($content: SignInContent) {\n    signIn(content: $content) {\n      accessToken\n      account_type\n      email\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BookmarkGrantCall(\n    $fundingCallId: ID!\n    $userID: ID!\n    $notes: String\n  ) {\n    bookmarkGrantCall(\n      fundingCallId: $fundingCallId\n      userID: $userID\n      notes: $notes\n    ) {\n      success\n      message\n      grantCall {\n        id\n        title\n        description\n        category\n        totalBudget\n        deadline\n        eligibility\n        status\n        applicationCount\n        isBookmarked\n        bookmarkNotes\n      }\n      bookmark {\n        id\n        userID\n        fundingCallId\n        fundingCallTitle\n        notes\n        bookmarkedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation BookmarkGrantCall(\n    $fundingCallId: ID!\n    $userID: ID!\n    $notes: String\n  ) {\n    bookmarkGrantCall(\n      fundingCallId: $fundingCallId\n      userID: $userID\n      notes: $notes\n    ) {\n      success\n      message\n      grantCall {\n        id\n        title\n        description\n        category\n        totalBudget\n        deadline\n        eligibility\n        status\n        applicationCount\n        isBookmarked\n        bookmarkNotes\n      }\n      bookmark {\n        id\n        userID\n        fundingCallId\n        fundingCallTitle\n        notes\n        bookmarkedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateFundingCall($content: CreateFundingCallInput!) {\n    createFundingCall(content: $content) {\n      id\n      funder\n      theme\n      totalAvailable\n      maximumAward\n      minimumAward\n      hasMinMaxAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n    }\n  }\n"): (typeof documents)["\n  mutation CreateFundingCall($content: CreateFundingCallInput!) {\n    createFundingCall(content: $content) {\n      id\n      funder\n      theme\n      totalAvailable\n      maximumAward\n      minimumAward\n      hasMinMaxAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateFundingCall($content: UpdateFundingCallInput!) {\n    updateFundingCall(content: $content) {\n      id\n      funder\n      totalAvailable\n      maximumAward\n      theme\n      description\n      hasMinMaxAward\n      minimumAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateFundingCall($content: UpdateFundingCallInput!) {\n    updateFundingCall(content: $content) {\n      id\n      funder\n      totalAvailable\n      maximumAward\n      theme\n      description\n      hasMinMaxAward\n      minimumAward\n      allowsMultipleApplications\n      openDate\n      originalCallLink\n      eligibility\n      createdBy\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProposal($input: CreateProposalInput!) {\n    createProposal(input: $input) {\n      success\n      message\n      errors\n      proposal {\n        id\n        title\n        abstract\n        userID\n        fundingCallId\n        fundingCallTitle\n        status\n        requestedAmount\n        department\n        submitted\n\n        user {\n          id\n          authUserId\n          name\n          email\n          role\n          status\n          department\n          staffId\n          phoneContact\n          avatar\n          lastLogin\n          createdAt\n          updatedAt\n        }\n\n        fundingCall {\n          id\n          funder\n          totalAvailable\n          maximumAward\n          theme\n          description\n          hasMinMaxAward\n          minimumAward\n          allowsMultipleApplications\n          openDate\n          originalCallLink\n          eligibility\n          createdBy\n          createdAt\n          updatedAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProposal($input: CreateProposalInput!) {\n    createProposal(input: $input) {\n      success\n      message\n      errors\n      proposal {\n        id\n        title\n        abstract\n        userID\n        fundingCallId\n        fundingCallTitle\n        status\n        requestedAmount\n        department\n        submitted\n\n        user {\n          id\n          authUserId\n          name\n          email\n          role\n          status\n          department\n          staffId\n          phoneContact\n          avatar\n          lastLogin\n          createdAt\n          updatedAt\n        }\n\n        fundingCall {\n          id\n          funder\n          totalAvailable\n          maximumAward\n          theme\n          description\n          hasMinMaxAward\n          minimumAward\n          allowsMultipleApplications\n          openDate\n          originalCallLink\n          eligibility\n          createdBy\n          createdAt\n          updatedAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  \n  mutation SignUpAssistantResearcher($content: CreateAssistantUserContent!) {\n    signUpAssistantResearcher(content: $content) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n"): (typeof documents)["\n  \n  mutation SignUpAssistantResearcher($content: CreateAssistantUserContent!) {\n    signUpAssistantResearcher(content: $content) {\n      temporaryPassword\n      user {\n        ...UserFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers {\n    getUsers {\n      users {\n        id\n        authUserId\n        name\n        email\n        role\n        status\n        department\n        staffId\n        phoneContact\n        avatar\n        lastLogin\n        createdAt\n        updatedAt\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    getUsers {\n      users {\n        id\n        authUserId\n        name\n        email\n        role\n        status\n        department\n        staffId\n        phoneContact\n        avatar\n        lastLogin\n        createdAt\n        updatedAt\n      }\n      totalCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGrantCalls(\n    $search: String\n    $status: String\n    $category: String\n    $limit: Int\n    $offset: Int\n    $userID: ID\n  ) {\n    grantCalls(\n      search: $search\n      status: $status\n      category: $category\n      limit: $limit\n      offset: $offset\n      userID: $userID\n    ) {\n      edges {\n        node {\n          id\n          title\n          description\n          category\n          totalBudget\n          deadline\n          eligibility\n          status\n          applicationCount\n          isBookmarked\n          bookmarkNotes\n        }\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query GetGrantCalls(\n    $search: String\n    $status: String\n    $category: String\n    $limit: Int\n    $offset: Int\n    $userID: ID\n  ) {\n    grantCalls(\n      search: $search\n      status: $status\n      category: $category\n      limit: $limit\n      offset: $offset\n      userID: $userID\n    ) {\n      edges {\n        node {\n          id\n          title\n          description\n          category\n          totalBudget\n          deadline\n          eligibility\n          status\n          applicationCount\n          isBookmarked\n          bookmarkNotes\n        }\n      }\n      totalCount\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;