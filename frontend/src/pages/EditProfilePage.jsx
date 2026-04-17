import EditProfileForm from "../components/profile/EditProfile";

export default function EditProfilePage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <EditProfileForm />
    </div>
  );
}