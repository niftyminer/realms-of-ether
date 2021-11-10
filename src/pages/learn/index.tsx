import { Container } from "nes-react";
import { FC } from "react";
import { Row } from "../../components/Row";

const dragonCavern = "/assets/dragon_cavern.png";
const goldMine = "/assets/gold_mine.png";
const stonePit = "/assets/stone_pit.png";
const timberCamp = "/assets/timber_camp.png";
const towerOfDragons = "/assets/tower_of_dragons.png";

const dragonOfWisdom = "/assets/dragon_of_wisdom.png";
const dragonOfPower = "/assets/dragon_of_power.png";

export const Learn: FC = () => {
  return (
    <>
      <div style={{ paddingBottom: 20 }}>
        <h4>Learn more about RoE</h4>
      </div>
      <div style={{ paddingBottom: 20 }}>
        <Container rounded title="FAQ">
          <div style={{ paddingBottom: 10 }}>
            <Container rounded title="What is this?">
              <a
                href="https://realms-of-ether.github.io/"
                target="_blank"
                rel="noreferrer"
              >
                Realms of Ether
              </a>{" "}
              is a strategy game running on Ethereum since 2017. This site is
              built by the community. Troops are spelled Troups in homage of the
              original site.
            </Container>
          </div>
          <Container rounded title="Links">
            <p>
              The revival of the project is done by the community, the original
              developer despite best efforts couldn't be reached.
            </p>
            <p>
              Join the conversation on{" "}
              <a
                href="https://discord.gg/4gQBBetS"
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </a>
            </p>
            <p>
              Follow the news on{" "}
              <a
                href="https://twitter.com/realms_of_ether"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </p>
          </Container>
        </Container>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Container rounded title="Buildings">
          <Building
            name="Timber Camp"
            description={
              "Produces wood\nCosts\nGold: 102\nStone: 341\n Wood: 227"
            }
            image={timberCamp}
          />
          <Building
            name="Gold Mine"
            description={
              "Produces gold\nCosts\nGold: 126\nStone: 231\n Wood: 482"
            }
            image={goldMine}
          />
          <Building
            name="Stone Pit"
            description={
              "Produces wood\nCosts\nGold: 82\nStone: 198\n Wood: 249"
            }
            image={stonePit}
          />
          <Building
            name="Dragon Cavern"
            description={
              "Produces Dragon of Power\nCosts\nGold: 140\nStone: 201\n Wood: 675"
            }
            image={dragonCavern}
          />
          <Building
            name="Tower of Dragons"
            description={
              "Produces Dragon of Wisdom\nCosts\nGold: 67\nStone: 124\n Wood: 433"
            }
            image={towerOfDragons}
          />
        </Container>
        <Container rounded title="Troups">
          <Building
            name="Dragon of Power"
            description={
              "Attributes\nlife: 70\nstrength: 70\nintelligence: 70\ndexterity: 70\nCosts\nGold: 109\nStone: 422\n Wood: 64"
            }
            image={dragonOfPower}
          />
          <Building
            name="Dragon of Wisdom"
            description={
              "Attributes\nlife: 105\nstrength: 105\nintelligence: 105\ndexterity: 105\nCosts\nGold: 271\nStone: 36\n Wood: 42"
            }
            image={dragonOfWisdom}
          />
        </Container>
      </div>
    </>
  );
};

const Building: FC<{ name: string; description: string; image: any }> = ({
  name,
  description,
  image,
}) => {
  const descriptionNodes = description.split("\n").map((str) => (
    <h6>
      {str}
      <br />
    </h6>
  ));
  return (
    <Row style={{ paddingBottom: 10 }}>
      <Container rounded>
        <img width={150} src={image} alt={name} />
      </Container>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <h4>{name}</h4>
        {descriptionNodes}
      </div>
    </Row>
  );
};

export default Learn;
