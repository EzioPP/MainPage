import './ProfileName.css'

interface ProfileNameProps {
  variant?: 'glass' | 'image'
}

function ProfileName({ variant = 'glass' }: ProfileNameProps) {
  return (
    <h1 className={`profile-name profile-name--${variant}`}>
      <span className="profile-name__first">Guro</span>
      <span className="profile-name__last">Naive</span>
    </h1>
  )
}

export default ProfileName
