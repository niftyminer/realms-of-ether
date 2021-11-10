import { Container, Table } from "nes-react";
import { FC } from "react";
import {
  calculateNameRarity,
  calculateXRarity,
  calculateYRarity,
  calculateDistance,
  calculateDistanceRarity,
  calculateYear,
  calculateYearRarity,
  FortressData,
  displayName,
} from "../metadata";

export const Traits: FC<{ fortressData: FortressData }> = ({
  fortressData,
}) => {
  return (
    <div style={{ padding: 10 }}>
      <Container rounded title="Traits">
        <Table dark bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rarity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{displayName(fortressData.name)}</td>
              <td>{calculateNameRarity(fortressData.name)} has this trait</td>
            </tr>
          </tbody>
        </Table>
        <div style={{ height: 20 }} />
        <Table bordered>
          <thead>
            <tr>
              <th>Coord</th>
              <th>Rarity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{fortressData.x}</td>
              <td>{calculateXRarity(fortressData.x)} has this trait</td>
            </tr>

            <tr>
              <td>{fortressData.y}</td>
              <td>{calculateYRarity(fortressData.y)} has this trait</td>
            </tr>
          </tbody>
        </Table>
        <div style={{ height: 20 }} />
        <Table bordered>
          <thead>
            <tr>
              <th>Distance</th>
              <th>Rarity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{calculateDistance(fortressData.x, fortressData.y)}</td>
              <td>
                {`${calculateDistanceRarity(
                  fortressData.x,
                  fortressData.y
                )}% has this trait`}
              </td>
            </tr>
          </tbody>
        </Table>
        <div style={{ height: 20 }} />
        <Table bordered>
          <thead>
            <tr>
              <th>Foundation</th>
              <th>Rarity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{calculateYear(fortressData.blockNumber)}</td>
              <td>
                {`${calculateYearRarity(
                  calculateYear(fortressData.blockNumber)
                )}% has this trait`}
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
