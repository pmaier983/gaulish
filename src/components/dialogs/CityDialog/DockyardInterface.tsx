import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"

export interface DockyardInterfaceProps extends BaseInterfaceProps {}

export const DockyardInterface = ({}: DockyardInterfaceProps) => {
  return <div className="flex flex-1 gap-2 overflow-x-auto p-2">Dockyard</div>
}
