// No userId here: the API assigns it from the auth token, and sending one from
// the client let a caller create gigs under someone else's account.
const INITIAL_STATE = {
  title: "",
  // Must be a slug from src/data.ts; the API validates against the same list.
  cat: "graphics-design",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revisionNumber: 0,
  features: [],
  price: 0,
};

const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return { ...state, [action.payload.name]: action.payload.value };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };

    case "ADD_FEATURE":
      return { ...state, features: [...state.features, action.payload] };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };

    default:
      return state;
  }
};
export { INITIAL_STATE, gigReducer };
