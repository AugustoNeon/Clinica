import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import type { TeamMember } from "@/types";

interface TeamGridProps {
  members: TeamMember[];
}

export function TeamGrid({ members }: TeamGridProps) {
  if (members.length === 0) {
    return <p className="opacity-80">Nenhum profissional cadastrado ainda.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <li key={member.id}>
          <Card className="h-full">
            <CardTitle>{member.name}</CardTitle>
            <p className="mt-1 text-sm opacity-70">{member.role}</p>
            {/* Divulgacao de profissional de odontologia exige o numero do CRO. */}
            {member.cro_number && (
              <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
                {member.cro_number}
              </p>
            )}
            <CardBody>{member.bio}</CardBody>
          </Card>
        </li>
      ))}
    </ul>
  );
}
