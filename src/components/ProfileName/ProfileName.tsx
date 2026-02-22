import './ProfileName.css'

interface ProfileNameProps {
  variant?: 'glass' | 'image'
}

function ProfileName({ variant = 'glass' }: ProfileNameProps) {
  return (
    <h1 className={`profile-name profile-name--${variant}`}>
      <span className="profile-name__first" data-text="Guro">Guro</span>
      <span className="profile-name__last" data-text="Naive">Naive</span>
    </h1>
  )
}

export default ProfileName