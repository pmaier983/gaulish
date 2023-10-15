import { and, eq } from "drizzle-orm"
import {
  FAKE_INITIAL_SHIP_PATH_ID,
  SHIP_TYPES,
  SHIP_TYPE_TO_SHIP_PROPERTIES,
  type ShipType,
} from "./../components/constants"
import type { DatabaseType } from "~/server/db"
import { createId } from "@paralleldrive/cuid2"
import { cargo, ship, type Ship } from "schema"

interface AddShipInputs {
  db: DatabaseType
  shipType: ShipType
  cityId: number
  userId: string
}

/**
 * Adds a ship to the user's account
 */
export const addShip = async ({
  db,
  shipType,
  cityId,
  userId,
}: AddShipInputs) => {
  const shipProperties = SHIP_TYPE_TO_SHIP_PROPERTIES[shipType]

  const allUserShips = await db.query.ship.findMany({
    where: and(eq(ship.userId, userId)),
    columns: {
      shipType: true,
    },
  })

  const countOfShipType = allUserShips.filter(
    (ship) => ship.shipType === shipType,
  ).length

  const newCargoId = createId()

  await db.insert(cargo).values({ id: newCargoId })

  const partialNewShip: Ship = {
    id: createId(),
    userId: userId,
    cityId: cityId,
    ...shipProperties,
    cargoId: newCargoId,
    isSunk: false,
    pathId: FAKE_INITIAL_SHIP_PATH_ID, // TODO: is there a better way to do this?
    name: `${SHIP_TYPES[shipType].toLowerCase()} ${countOfShipType + 1}`,
  }

  await db.insert(ship).values(partialNewShip)

  const newShip = await db.query.ship.findFirst({
    where: eq(ship.id, partialNewShip.id),
    with: {
      path: true,
      cargo: true,
    },
  })

  if (!newShip)
    throw new Error("Ship was not found immediately after being inserted")

  // TODO: Add the tiles around that ship to the knowTiles list

  return newShip
}
