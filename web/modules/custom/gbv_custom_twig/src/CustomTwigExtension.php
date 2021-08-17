<?php

namespace Drupal\gbv_custom_twig;

use Twig_SimpleFunction;
use Twig_ExtensionInterface;
use Drupal;
use Twig_Extension;
use Drupal\node\Entity\Node;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

/**
 * Extend Drupal's Twig_Extension class.
 */
class CustomTwigExtension extends Twig_Extension {

  /**
   * Name of twig.
   */
  public function getName() {
    return 'gbv_custom_twig.CustomTwigExtension';
  }

  /**
   * Return your custom twig function to Drupal.
   */
  public function getFunctions() {
    $functions = [
      new Twig_SimpleFunction('load_tax_term', [$this, 'loadTaxTerm']),
      new Twig_SimpleFunction('load_tax_children', [$this, 'loadTaxChildren']),
      new Twig_SimpleFunction('get_nodes_by_taxonomy_term_ids', [
        $this,
        'getNodesByTaxonomyTermIds',
      ]),
      new Twig_SimpleFunction('load_vocabulary_term', [
        $this,
        'loadVocabularyTerm',
      ]),
      new Twig_SimpleFunction('check_taxonomy_has_items', [
        $this,
        'checkTaxonomyHasItems',
      ]),
      new Twig_SimpleFunction('media_file_url', [$this, 'mediaFileUrl']),
      new Twig_SimpleFunction('get_node', [$this, 'getNode']),
      new Twig_SimpleFunction('media_file_type', [$this, 'mediaFileType']),
    ];
    return $functions;
  }

  /**
   * Returns taxonomy term.
   *
   * @param string $tid
   *   Tid of the taxonomy.
   *
   * @return array
   *   Taxonomy term.
   */
  public static function loadTaxTerm($tid) {
    $taxonomy_term = Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->load($tid);
    return $taxonomy_term;
  }

  /**
   * Returns tree of the taxonomy.
   *
   * @param string $tid
   *   Tid of the taxonomy.
   *
   * @return array
   *   Tree of taxonomy.
   */
  public static function loadTaxChildren($tid) {
    $children = Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadChildren($tid);
    // FIXME: sort by id or weight?
    return $children;
  }

  /**
   * Returns tree of the taxonomy.
   *
   * @param array $termIds
   *   Tid of the taxonomy term.
   * @param string $countMode
   *   Mode of operation.
   *
   * @return array
   *   Nodes belonging to term.
   */
  public static function getNodesByTaxonomyTermIds(array $termIds, $countMode = FALSE) {
    $termIds = (array) $termIds;
    if (empty($termIds)) {
      return NULL;
    }
    $connection = Drupal::database();
    $query_string = "SELECT " . ($countMode ? "COUNT(DISTINCT t0.nid)" : "DISTINCT t0.nid") . " FROM taxonomy_index t0 ";
    if (count($termIds) == 1) {
      $query_string .= "WHERE t0.tid=" . $termIds[0];
    }
    else {
      for ($index = 0; $index < count($termIds) - 1; $index++) {
        $nextIndex = $index + 1;
        $query_string .= "INNER JOIN taxonomy_index t" . $nextIndex;
        $query_string .= " on t" . $index . ".tid=" . $termIds[$index] . " AND t" . $nextIndex;
        $query_string .= ".tid=" . $termIds[$nextIndex];
        $query_string .= " AND t" . $index . ".nid=t" . $nextIndex . ".nid";
      }
    }
    $query = $connection->query($query_string);
    if ($countMode) {
      $nodeIdsCount = $query->fetchCol();
      return (int) $nodeIdsCount[0];
    }
    $nodeIds = $query->fetchCol();
    if ($nodeIds) {
      return Node::loadMultiple($nodeIds);
    }
    return NULL;
  }

  /**
   * Returns tree of the vocabulary.
   *
   * @param string $vid
   *   Vid of the vocabulary.
   * @param string $depth
   *   Number of levels of the tree to return.
   *
   * @return array
   *   Tree of vocabulary.
   */
  public static function loadVocabularyTerm($vid, $depth = NULL) {
    $terms = Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadTree($vid, 0, $depth);
    foreach ($terms as $term) {
      $term_data[] = [
        'id' => $term->tid,
        'name' => $term->name,
      ];
    }
    return $term_data;
  }

  /**
   * Checks if child terms have item.
   *
   * @param string $termId
   *   Termid of the term.
   * @param array $sections
   *   Section ids.
   *
   * @return array
   *   Tree of vocabulary.
   */
  public function checkTaxonomyHasItems($termId, array $sections) {
    $has_item = FALSE;
    for ($i = 0; $i < count($sections); $i++) {
      $section_item_count = $this->getNodesByTaxonomyTermIds([
        $termId,
        $sections[$i]["id"],
      ], TRUE);
      if ($section_item_count > 0) {
        $has_item = TRUE;
        break;
      }
    }
    return $has_item;
  }

  /**
   * Returns the file URL from a media entity.
   *
   * @param string $mid
   *   The media entity target id.
   * @param string $field
   *   The media field.
   *
   * @return string
   *   The file url.
   */
  public function mediaFileUrl($mid, $field = 'field_media_image') {
    if (!$mid) {
      return NULL;
    }
    $media = Media::load($mid);
    $fid = $media->$field->target_id;
    $file = File::load($fid);
    if ($file) {
      $url = $file->url();
      return $url;
    }
    return NULL;
  }

  /**
   * Returns the node object from a target id.
   *
   * @param string $nid
   *   The tagret node id.
   *
   * @return string
   *   The file url.
   */
  public function getNode($nid) {
    $object = Node::load($nid);
    return $object;
  }

  /**
   * Returns the file URL from a media entity.
   *
   * @param string $mid
   *   The media entity target id.
   * @param string $field
   *   The media field.
   *
   * @return string
   *   The file type.
   */
  public function mediaFileType($mid, $field = 'field_media_file') {
    if (!$mid) {
      return NULL;
    }
    $media = Media::load($mid);
    $fid = $media->$field->target_id;
    $file = File::load($fid);
    if ($file) {
      $type = $file->getFilename();
      $ext = pathinfo($type, PATHINFO_EXTENSION);
      return $ext;
    }
    return NULL;
  }

}
