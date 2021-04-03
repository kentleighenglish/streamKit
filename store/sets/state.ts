import { SetsState } from "@/types/store";

export default (): SetsState => ({
  currentSet: null,
  currentCell: {
    layer: null,
    slide: null,
  },
  sets: [],
  loaded: false,
  saving: false,
  _recentlySaved: false,
});
