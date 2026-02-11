import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProjectView from "@/components/ProjectView";

async function getProjectData(id: string) {
  const { data: project } = await supabase
    .from('projects')
    .select('*, metadata(*), assets(*)')
    .eq('id', id)
    .single();
  
  return project;
}

export default async function ProjectDetails({ params }: { params: { id: string } }) {
  const { id } = await params;
  const project = await getProjectData(id);

  if (!project) {
    notFound();
  }

  return <ProjectView project={project} />;
}
