import React from "react";
import { useParams } from "react-router-dom";
import Establishment from "../components/establishment/Establishment";
import PostsAtEstablishment from "../components/establishment/PostsAtEstablishment";
import Layout from "../components/shared/Layout";
import { useQuery } from "@apollo/client";
import { GET_ESTABLISHMENT } from "./../graphql/queries";
import EstablishmentSkeleton from "../components/establishment/EstablishmentSkeleton";

function EstablishmentPage() {
  const { establishmentId } = useParams();

  const variables = {
    establishmentId,
  };
  const { data, loading } = useQuery(GET_ESTABLISHMENT, { variables });

  if (loading)
    return (
      <Layout>
        <EstablishmentSkeleton />
      </Layout>
    );

  const establishment = data.establishments_by_pk;
  return (
    <Layout>
      <Establishment establishment={establishment} />
      <PostsAtEstablishment establishment={establishment} />
    </Layout>
  );
}

export default EstablishmentPage;
