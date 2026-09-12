import React, { useEffect, useState } from "react";

import {
  Trophy,
  Code2,
  Brain,
  Palette,
  Dumbbell,
  Music,
  PlusCircle,
  X,
  Loader2,
  Trash2,
  Upload,
  FileImage,
  Calendar,
  MapPin,
  Link,
  ExternalLink,
  Users,
  Radio,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  Info
} from "lucide-react";

const API_URL = "https://news-nest-eta.vercel.app/api/clubs";
const SERVER_URL = "https://news-nest-eta.vercel.app";

export default function HackathonsView({
  currentUser,
  searchQuery = ""
}) {
  const [posts, setPosts] = useState([]);

  const [activeClub, setActiveClub] =
    useState("All");

  const [activeType, setActiveType] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [club, setClub] =
    useState("Coding Club");

  const [type, setType] =
    useState("Event");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [venue, setVenue] =
    useState("");

  const [startDateTime, setStartDateTime] =
    useState("");

  const [endDateTime, setEndDateTime] =
    useState("");

  const [
    registrationDeadline,
    setRegistrationDeadline
  ] = useState("");

  const [
    registrationLink,
    setRegistrationLink
  ] = useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [posting, setPosting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const clubs = [
    {
      name: "All",
      icon: Users
    },
    {
      name: "Culturals Club",
      icon: Music
    },
    {
      name: "Sports Club",
      icon: Dumbbell
    },
    {
      name: "Coding Club",
      icon: Code2
    },
    {
      name: "Creative Club",
      icon: Palette
    },
    {
      name: "AI Club",
      icon: Brain
    },
    {
      name: "Hackathon Club",
      icon: Trophy
    }
  ];

  const types = [
    "All",
    "Event",
    "Achievement",
    "Winner",
    "Update"
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        API_URL,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to fetch club posts"
        );
      }

      setPosts(
        data.posts || []
      );

    } catch (error) {
      console.error(
        "Fetch club posts error:",
        error
      );

      setError(
        error.message ||
        "Failed to load club posts"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 10 MB."
      );

      e.target.value = "";

      return;
    }

    setError("");

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview("");

    const fileInput =
      document.getElementById(
        "club-post-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const resetForm = () => {
    setClub("Coding Club");

    setType("Event");

    setTitle("");

    setDescription("");

    setVenue("");

    setStartDateTime("");

    setEndDateTime("");

    setRegistrationDeadline("");

    setRegistrationLink("");

    handleRemoveImage();

    setError("");
  };

  const handleCreatePost =
    async (e) => {
      e.preventDefault();

      if (!title.trim()) {
        setError(
          "Please enter a title."
        );

        return;
      }

      if (!description.trim()) {
        setError(
          "Please enter a description."
        );

        return;
      }

      if (
        type === "Event" &&
        !startDateTime
      ) {
        setError(
          "Please select the event start date and time."
        );

        return;
      }

      if (
        type === "Event" &&
        !endDateTime
      ) {
        setError(
          "Please select the event end date and time."
        );

        return;
      }

      if (
        type === "Event" &&
        new Date(startDateTime) >=
        new Date(endDateTime)
      ) {
        setError(
          "End date and time must be after the start date and time."
        );

        return;
      }

      if (
        registrationDeadline &&
        startDateTime &&
        new Date(
          registrationDeadline
        ) >
        new Date(
          startDateTime
        )
      ) {
        setError(
          "Registration deadline must be before the event starts."
        );

        return;
      }

      try {
        setPosting(true);

        setError("");

        setSuccess("");

        const formData =
          new FormData();

        formData.append(
          "club",
          club
        );

        formData.append(
          "type",
          type
        );

        formData.append(
          "title",
          title.trim()
        );

        formData.append(
          "description",
          description.trim()
        );

        formData.append(
          "venue",
          venue.trim()
        );

        if (startDateTime) {
          formData.append(
            "startDateTime",
            startDateTime
          );
        }

        if (endDateTime) {
          formData.append(
            "endDateTime",
            endDateTime
          );
        }

        if (registrationDeadline) {
          formData.append(
            "registrationDeadline",
            registrationDeadline
          );
        }

        if (
          registrationLink.trim()
        ) {
          formData.append(
            "registrationLink",
            registrationLink.trim()
          );
        }

        if (imageFile) {
          formData.append(
            "image",
            imageFile
          );
        }

        const response =
          await fetch(
            API_URL,
            {
              method: "POST",

              credentials:
                "include",

              body: formData
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to publish club post"
          );
        }

        if (data.post) {
          setPosts((prev) => [
            data.post,
            ...prev
          ]);
        } else {
          await fetchPosts();
        }

        resetForm();

        setShowForm(false);

        setSuccess(
          "Club post published successfully."
        );

        setTimeout(() => {
          setSuccess("");
        }, 3000);

      } catch (error) {
        console.error(
          "Create club post error:",
          error
        );

        setError(
          error.message ||
          "Failed to publish club post"
        );

      } finally {
        setPosting(false);
      }
    };

  const handleDeletePost =
    async (id) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this post?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(id);

        setError("");

        setSuccess("");

        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "DELETE",

              credentials:
                "include"
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to delete post"
          );
        }

        setPosts((prev) =>
          prev.filter(
            (post) =>
              String(
                post.id ||
                post._id
              ) !==
              String(id)
          )
        );

        setSuccess(
          "Club post deleted successfully."
        );

        setTimeout(() => {
          setSuccess("");
        }, 3000);

      } catch (error) {
        console.error(
          "Delete club post error:",
          error
        );

        setError(
          error.message ||
          "Failed to delete post"
        );

      } finally {
        setDeletingId(null);
      }
    };

  const formatDateTime =
    (date) => {
      if (!date) {
        return "";
      }

      const parsedDate =
        new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return "";
      }

      return parsedDate.toLocaleString(
        "en-IN",
        {
          day: "2-digit",

          month: "short",

          year: "numeric",

          hour: "2-digit",

          minute: "2-digit"
        }
      );
    };

  const getImageUrl =
    (image) => {
      if (!image) {
        return null;
      }

      if (
        image.startsWith(
          "http"
        )
      ) {
        return image;
      }

      return `${SERVER_URL}${image}`;
    };

  const isPostOwner =
    (post) => {
      if (
        post.isOwner !== undefined
      ) {
        return post.isOwner;
      }

      if (
        !currentUser ||
        !post
      ) {
        return false;
      }

      const currentUserId =
        currentUser._id ||
        currentUser.id;

      const postUser =
        post.user;

      if (
        !currentUserId ||
        !postUser
      ) {
        return false;
      }

      const postUserId =
        typeof postUser ===
          "object"
          ? postUser._id ||
          postUser.id
          : postUser;

      return (
        String(currentUserId) ===
        String(postUserId)
      );
    };

  const getClubIcon =
    (clubName) => {
      const selectedClub =
        clubs.find(
          (item) =>
            item.name ===
            clubName
        );

      return selectedClub
        ? selectedClub.icon
        : Users;
    };

  const getTypeStyle =
    (postType) => {
      switch (postType) {
        case "Event":
          return "bg-blue-500/10 text-blue-400 border-blue-500/20";

        case "Achievement":
          return "bg-purple-500/10 text-purple-400 border-purple-500/20";

        case "Winner":
          return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

        default:
          return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      }
    };

  const getStatusStyle =
    (status) => {
      switch (status) {
        case "LIVE":
          return "bg-red-500/10 text-red-400 border-red-500/30";

        case "UPCOMING":
          return "bg-green-500/10 text-green-400 border-green-500/20";

        case "COMPLETED":
          return "bg-gray-500/10 text-gray-400 border-gray-500/20";

        default:
          return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      }
    };

  const filteredPosts =
    posts.filter((post) => {
      const matchesClub =
        activeClub === "All" ||
        post.club ===
        activeClub;

      const matchesType =
        activeType === "All" ||
        post.type ===
        activeType;

      const search =
        searchQuery
          .toLowerCase()
          .trim();

      if (!search) {
        return (
          matchesClub &&
          matchesType
        );
      }

      return (
        matchesClub &&
        matchesType &&
        (
          post.title
            ?.toLowerCase()
            .includes(search) ||

          post.description
            ?.toLowerCase()
            .includes(search) ||

          post.club
            ?.toLowerCase()
            .includes(search) ||

          post.type
            ?.toLowerCase()
            .includes(search) ||

          post.venue
            ?.toLowerCase()
            .includes(search)
        )
      );
    });

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">

            <Trophy className="w-5 h-5 text-indigo-400" />

            Hackathons & Clubs

          </h2>

          <p className="text-xs text-gray-400 mt-1">

            Discover upcoming club events,
            hackathons, achievements,
            winners and important updates.

          </p>

        </div>

        <button
          onClick={() => {
            setShowForm(
              (prev) => !prev
            );

            setError("");
          }}
          className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
        >

          {showForm ? (
            <X className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}

          {showForm
            ? "Cancel"
            : "Post Club Update"}

        </button>

      </div>

      {error && (

        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-xs">

          {error}

        </div>

      )}

      {success && (

        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-xs">

          {success}

        </div>

      )}

      {showForm && (

        <div className="bg-[#111827] border border-indigo-500/20 rounded-3xl p-5 shadow-xl">

          <h3 className="text-sm font-bold text-white">

            Create Club Post

          </h3>

          <p className="text-[11px] text-gray-500 mt-1 mb-5">

            Publish upcoming events,
            achievements, winners
            and club updates.

          </p>

          <form
            onSubmit={
              handleCreatePost
            }
            className="space-y-4"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

                <label className="text-xs font-semibold text-gray-300 block mb-2">

                  Club

                </label>

                <select
                  value={club}
                  onChange={(e) =>
                    setClub(
                      e.target.value
                    )
                  }
                  className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                >

                  {clubs
                    .filter(
                      (item) =>
                        item.name !==
                        "All"
                    )
                    .map(
                      (item) => (

                        <option
                          key={
                            item.name
                          }
                          value={
                            item.name
                          }
                        >

                          {item.name}

                        </option>

                      )
                    )}

                </select>

              </div>

              <div>

                <label className="text-xs font-semibold text-gray-300 block mb-2">

                  Post Type

                </label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value
                    )
                  }
                  className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                >

                  <option value="Event">
                    Event
                  </option>

                  <option value="Achievement">
                    Achievement
                  </option>

                  <option value="Winner">
                    Winner
                  </option>

                  <option value="Update">
                    Update
                  </option>

                </select>

              </div>

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Title

              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Enter post title"
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Description

              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Write complete details..."
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 resize-none"
              />

            </div>

            <div>

              <label className="text-xs font-semibold text-gray-300 block mb-2">

                Venue

              </label>

              <input
                type="text"
                value={venue}
                onChange={(e) =>
                  setVenue(
                    e.target.value
                  )
                }
                placeholder="Example: Main Auditorium"
                className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
              />

            </div>

            {type === "Event" && (

              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="text-xs font-semibold text-gray-300 block mb-2">

                      Start Date & Time

                    </label>

                    <input
                      type="datetime-local"
                      value={
                        startDateTime
                      }
                      onChange={(e) =>
                        setStartDateTime(
                          e.target.value
                        )
                      }
                      className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                    />

                  </div>

                  <div>

                    <label className="text-xs font-semibold text-gray-300 block mb-2">

                      End Date & Time

                    </label>

                    <input
                      type="datetime-local"
                      value={
                        endDateTime
                      }
                      onChange={(e) =>
                        setEndDateTime(
                          e.target.value
                        )
                      }
                      className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-xs font-semibold text-gray-300 block mb-2">

                    Registration Deadline

                  </label>

                  <input
                    type="datetime-local"
                    value={
                      registrationDeadline
                    }
                    onChange={(e) =>
                      setRegistrationDeadline(
                        e.target.value
                      )
                    }
                    className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                  />

                </div>

                <div>

                  <label className="text-xs font-semibold text-gray-300 block mb-2">

                    Registration Link

                  </label>

                  <input
                    type="url"
                    value={
                      registrationLink
                    }
                    onChange={(e) =>
                      setRegistrationLink(
                        e.target.value
                      )
                    }
                    placeholder="https://forms.google.com/..."
                    className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                  />

                </div>

              </div>

            )}

            <div>

              <label className="text-xs font-semibold text-gray-300 flex items-center gap-2 mb-2">

                <FileImage className="w-3.5 h-3.5 text-indigo-400" />

                Image

              </label>

              {!imageFile ? (

                <label
                  htmlFor="club-post-image"
                  className="flex flex-col items-center justify-center min-h-[150px] bg-[#151c2c] border border-dashed border-[#374151] hover:border-indigo-500 rounded-2xl cursor-pointer transition-all"
                >

                  <Upload className="w-6 h-6 text-indigo-400 mb-3" />

                  <p className="text-xs text-gray-300 font-semibold">

                    Choose an image

                  </p>

                  <p className="text-[10px] text-gray-500 mt-1">

                    JPG, PNG or WEBP • Maximum 10 MB

                  </p>

                  <input
                    id="club-post-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                </label>

              ) : (

                <div className="bg-[#151c2c] border border-[#1f2937] rounded-2xl p-3">

                  <div className="flex items-center justify-between mb-3">

                    <div className="flex items-center gap-2 min-w-0">

                      <FileImage className="w-4 h-4 text-indigo-400 shrink-0" />

                      <p className="text-xs text-gray-300 truncate">

                        {imageFile.name}

                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRemoveImage
                      }
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    >

                      <X className="w-4 h-4" />

                    </button>

                  </div>

                  {imagePreview && (

                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-[350px] object-contain rounded-xl"
                    />

                  )}

                </div>

              )}

            </div>

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >

                Cancel

              </button>

              <button
                type="submit"
                disabled={posting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >

                {posting && (

                  <Loader2 className="w-3.5 h-3.5 animate-spin" />

                )}

                {posting
                  ? "Publishing..."
                  : "Publish Post"}

              </button>

            </div>

          </form>

        </div>

      )}

      <div className="space-y-4">

        <div className="flex gap-2 overflow-x-auto pb-1">

          {clubs.map((item) => {
            const Icon =
              item.icon;

            return (

              <button
                key={item.name}
                onClick={() =>
                  setActiveClub(
                    item.name
                  )
                }
                className={`px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${activeClub ===
                  item.name
                  ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30"
                  : "bg-transparent text-gray-400 border-transparent hover:text-white"
                  }`}
              >

                <Icon className="w-3.5 h-3.5" />

                {item.name}

              </button>

            );
          })}

        </div>

        <div className="flex flex-wrap gap-2">

          {types.map(
            (postType) => (

              <button
                key={postType}
                onClick={() =>
                  setActiveType(
                    postType
                  )
                }
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${activeType ===
                  postType
                  ? "bg-indigo-600 text-white border-indigo-500"
                  : "bg-[#111827] text-gray-400 border-[#1f2937] hover:text-white"
                  }`}
              >

                {postType}

              </button>

            )
          )}

        </div>

      </div>

      {loading && (

        <div className="flex justify-center py-16">

          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />

        </div>

      )}

      {!loading && (

        <div className="space-y-5">

          {filteredPosts.length ===
            0 ? (

            <div className="text-center py-16 bg-[#111827] border border-[#1f2937] rounded-3xl text-gray-500 text-xs">

              No club posts found.

            </div>

          ) : (

            filteredPosts.map(
              (post) => {
                const postId =
                  post.id ||
                  post._id;

                const ClubIcon =
                  getClubIcon(
                    post.club
                  );

                const owner =
                  isPostOwner(
                    post
                  );

                const imageUrl =
                  getImageUrl(
                    post.image
                  );

                return (

                  <div
                    key={postId}
                    className="bg-[#111827] border border-[#1f2937] rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all"
                  >

                    {imageUrl && (

                      <div className="bg-[#151c2c] border-b border-[#1f2937]">

                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full max-h-[500px] object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      </div>

                    )}

                    <div className="p-5 md:p-6 space-y-4">

                      <div className="flex flex-wrap items-start justify-between gap-3">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">

                            <ClubIcon className="w-3 h-3" />

                            {post.club}

                          </span>

                          <span
                            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${getTypeStyle(
                              post.type
                            )}`}
                          >

                            {post.type}

                          </span>

                          {post.type ===
                            "Event" && (

                              <span
                                className={`px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1 ${getStatusStyle(
                                  post.eventStatus
                                )}`}
                              >

                                {post.eventStatus ===
                                  "LIVE" && (

                                    <Radio className="w-3 h-3 animate-pulse" />

                                  )}

                                {post.eventStatus}

                              </span>

                            )}

                        </div>

                        {owner && (

                          <button
                            onClick={() =>
                              handleDeletePost(
                                postId
                              )
                            }
                            disabled={
                              deletingId ===
                              postId
                            }
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl disabled:opacity-50"
                          >

                            {deletingId ===
                              postId ? (

                              <Loader2 className="w-4 h-4 animate-spin" />

                            ) : (

                              <Trash2 className="w-4 h-4" />

                            )}

                          </button>

                        )}

                      </div>

                      <div>

                        <h3 className="text-base md:text-lg font-bold text-white">

                          {post.title}

                        </h3>

                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed mt-2 whitespace-pre-line">

                          {post.description}

                        </p>

                      </div>

                      {post.venue && (

                        <div className="flex items-center gap-2 text-xs text-gray-400">

                          <MapPin className="w-4 h-4 text-indigo-400" />

                          {post.venue}

                        </div>

                      )}

                      {post.type ===
                        "Event" && (

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {post.startDateTime && (

                              <div className="bg-[#151c2c] border border-[#1f2937] rounded-xl p-3">

                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">

                                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />

                                  STARTS

                                </div>

                                <p className="text-xs text-gray-300">

                                  {formatDateTime(
                                    post.startDateTime
                                  )}

                                </p>

                              </div>

                            )}

                            {post.endDateTime && (

                              <div className="bg-[#151c2c] border border-[#1f2937] rounded-xl p-3">

                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">

                                  <Clock className="w-3.5 h-3.5 text-indigo-400" />

                                  ENDS

                                </div>

                                <p className="text-xs text-gray-300">

                                  {formatDateTime(
                                    post.endDateTime
                                  )}

                                </p>

                              </div>

                            )}

                          </div>

                        )}

                      {post.type ===
                        "Event" &&
                        post.registrationLink && (

                          <div className="space-y-3">

                            {post.registrationDeadline && (

                              <div className="flex items-center gap-2 text-[11px] text-gray-500">

                                <Clock className="w-3.5 h-3.5 text-indigo-400" />

                                Registration deadline:

                                <span className="text-gray-300">

                                  {formatDateTime(
                                    post.registrationDeadline
                                  )}

                                </span>

                              </div>

                            )}

                            {post.registrationStatus ===
                              "OPEN" ? (

                              <a
                                href={
                                  post.registrationLink
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full md:w-fit px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                              >

                                <CheckCircle2 className="w-4 h-4" />

                                Register Now

                                <ExternalLink className="w-3.5 h-3.5" />

                              </a>

                            ) : (

                              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-500/10 border border-gray-500/20 text-gray-400 rounded-xl text-xs font-semibold">

                                <Clock className="w-4 h-4" />

                                Registration Closed

                              </div>

                            )}

                          </div>

                        )}

                      <div className="pt-3 border-t border-[#1f2937] flex flex-wrap items-center justify-between gap-2">

                        <div className="flex items-center gap-2 text-[10px] text-gray-500">

                          <Info className="w-3.5 h-3.5 text-indigo-400" />

                          Posted by

                          <span className="text-gray-300">

                            {post.userName ||
                              "Unknown User"}

                          </span>

                        </div>

                        <div className="text-[10px] text-gray-600">

                          {formatDateTime(
                            post.createdAt
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                );
              }
            )

          )}

        </div>

      )}

    </div>
  );
}