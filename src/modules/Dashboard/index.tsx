import React from "react";
import { Flex, Text } from "rebass";
import { Card } from "../CommonUi/Card";

export function Dashboard() {
  return (
    <Flex flexDirection="column" p={3} alignItems="center">
      <Card>
        <Text textAlign="center" fontWeight="bold" fontSize={2}>
          Remuneration
        </Text>
        <Text textAlign="center" fontWeight="bold" fontSize={3}>
          6000€
        </Text>
      </Card>
      <Text>EXERCICE 2019</Text>
      <Flex
        width={"100%"}
        justifyContent="space-between"
        flexWrap={["wrap", "nowrap"]}
      >
        <Card width={4 / 6} mx={2}>
          <Text textAlign="center" fontWeight="bold" fontSize={3}>
            Activité
          </Text>
          <Flex justifyContent="space-between" flexWrap={["wrap", "nowrap"]}>
            <Card mx={5}>
              <Text textAlign="center">Chiffre d'affaires</Text>
              <Text textAlign="center" fontSize={3}>
                100 000€
              </Text>
            </Card>
            <Card mx={5}>
              <Text textAlign="center">Remunération</Text>
              <Text textAlign="center" fontSize={3}>
                60 000€
              </Text>
            </Card>
          </Flex>
        </Card>

        <Card mx={2} width={2 / 6}>
          <Text textAlign="center" fontWeight="bold" fontSize={3}>
            Fiscal & Social
          </Text>
          <Flex flexDirection="column" alignItems="center">
            <Card mx={5}>
              <Text textAlign="center">Encours TVA</Text>
              <Text textAlign="center" fontSize={3}>
                20 000€
              </Text>
            </Card>
            <Card mx={5}>
              <Text textAlign="center">Estimation cotissations sociales</Text>
              <Text textAlign="center" fontSize={3}>
                24 000€
              </Text>
            </Card>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
