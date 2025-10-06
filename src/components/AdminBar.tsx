import netlifyIdentity from 'netlify-identity-widget';
//import { isAdmin } from '../lib/identity';

export default function AdminBar({ editMode, onSave }:{
  editMode: boolean; onSave: ()=>void;
}) {
  const loggedIn = !!netlifyIdentity.currentUser();

  return (
    <div className="admin-bar">
      <span>My Anime TierMaker</span>
      {editMode && <button className="primary" onClick={onSave}>저장</button>}
      {!loggedIn && <button className="ghost" onClick={() => netlifyIdentity.open('login')}>Login</button>}
      {loggedIn && <button className="ghost" onClick={() => netlifyIdentity.logout()}>Logout</button>}
    </div>
  );
}
