import { NodeComponent, FontAwesomeIcon as Icon } from 'substance'
import MetadataSection from './MetadataSection'

/*
  Edit affiliations for a publication in this MetadataSection
*/
export default class AffiliationsComponent extends NodeComponent {

  getInitialState() {
    return {
      expanded: true
    }
  }

  render($$) {
    const doc = this.context.editorSession.getDocument()
    const affGroup = this.props.node
    const TextPropertyEditor = this.getComponent('text-property-editor')

    let el = $$('div').addClass('sc-affiliations')

    el.append(
      $$(MetadataSection, {
        label: 'Affiliations',
        expanded: this.state.expanded
      }).on('click', this._toggle)
    )

    if (this.state.expanded) {
      affGroup.getChildren().forEach((aff) => {
        let stringAff = aff.findChild('string-aff')
        // at the moment we only render string-affs
        if (stringAff) {
          el.append(
            $$('div').addClass('se-aff').append(
              $$(TextPropertyEditor, {
                history: 'affs',
                path: stringAff.getTextPath(),
                disabled: this.props.disabled
              }).ref(stringAff.id)
            )
          )
        }
      })

      el.append(
        $$('button')
          .append('Add Affiliation')
          .on('click', this._addAffiliation)
      )
    }
    return el
  }

  _toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  _addAffiliation() {
    const nodeId = this.props.node.id
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let affGroup = doc.get(nodeId)
      let aff = doc.createElement('aff').attr('aff-type', 'foo')
      aff.append(
        doc.createElement('string-aff')
      )
      affGroup.append(aff)
    })
  }
}